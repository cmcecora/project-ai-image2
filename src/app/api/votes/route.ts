import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageId, userId, choice } = body;

    // Validate input
    if (!imageId || !choice || !['ai', 'real'].includes(choice)) {
      return new Response(JSON.stringify({ error: 'Invalid input: imageId, userId (optional), and choice (ai/real) are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // If a userId is provided, ensure the user exists to avoid FK errors
    let ensuredUserId: string | null = null;
    if (userId && typeof userId === 'string') {
      const defaultUsername = `User_${userId.substring(0, 8)}`;
      const user = await prisma.user.upsert({
        where: { id: userId },
        update: {},
        create: {
          id: userId,
          username: defaultUsername,
        },
        select: { id: true },
      });
      ensuredUserId = user.id;
    }

    // Insert or update the vote
    let vote;
    if (ensuredUserId) {
      // For identified users, prevent duplicate votes per image by upserting on the composite unique key
      vote = await prisma.vote.upsert({
        where: { imageId_userId: { imageId, userId: ensuredUserId } },
        update: { choice },
        create: { imageId, userId: ensuredUserId, choice },
      });
    } else {
      // Anonymous votes (no userId) cannot use the composite unique index; create a new vote
      vote = await prisma.vote.create({
        data: { imageId, userId: null, choice },
      });
    }

    // Update the stats for the image
    await updateImageStats(imageId);

    return new Response(JSON.stringify({ 
      success: true, 
      voteId: vote.id,
      message: 'Vote recorded successfully'
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error recording vote:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Helper function to update image statistics
async function updateImageStats(imageId: string) {
  // Get all votes for this image
  const votes = await prisma.vote.findMany({
    where: { imageId },
  });

  const totalVotes = votes.length;
  const aiVotes = votes.filter((vote: { choice: string }) => vote.choice === 'ai').length;
  const realVotes = votes.filter((vote: { choice: string }) => vote.choice === 'real').length;

  // Calculate percentages
  const aiPercentage = totalVotes > 0 ? Math.round((aiVotes / totalVotes) * 100) : 0;
  const realPercentage = 100 - aiPercentage;

  // Update or create the stats record
  await prisma.stat.upsert({
    where: { imageId },
    update: {
      totalVotes,
      aiVotes,
      realVotes,
      aiPercentage,
      realPercentage,
    },
    create: {
      imageId,
      totalVotes,
      aiVotes,
      realVotes,
      aiPercentage,
      realPercentage,
    },
  });
}