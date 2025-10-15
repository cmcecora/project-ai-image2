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

    // Create the vote
    const vote = await prisma.vote.create({
      data: {
        imageId,
        userId: userId || null, // Allow null userId for anonymous votes
        choice,
      },
    });

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