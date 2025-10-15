import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, totalGames, correctGuesses, bestStreak } = body;

    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate numeric inputs
    if (
      typeof totalGames !== 'number' || 
      typeof correctGuesses !== 'number' || 
      typeof bestStreak !== 'number'
    ) {
      return new Response(JSON.stringify({ error: 'Invalid stats data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Calculate accuracy
    const accuracy = totalGames > 0 ? (correctGuesses / totalGames) * 100 : 0;

    // Update or create user record
    const user = await prisma.user.upsert({
      where: { id: userId },
      update: {
        totalScore: correctGuesses, // Using correctGuesses as score for now
        accuracy,
        bestStreak,
        totalPlayed: totalGames,
      },
      create: {
        id: userId,
        username: `User_${userId.substring(0, 8)}`, // Generate a default username
        totalScore: correctGuesses,
        accuracy,
        bestStreak,
        totalPlayed: totalGames,
      },
    });

    // Update leaderboard entry
    await updateLeaderboard(userId, correctGuesses);

    return new Response(JSON.stringify({ 
      success: true, 
      userId: user.id,
      message: 'User stats updated successfully' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating user stats:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Helper function to update leaderboard
async function updateLeaderboard(userId: string, score: number) {
  // Update or create the leaderboard entry
  await prisma.leaderboard.upsert({
    where: { userId },
    update: {
      score,
      updatedAt: new Date(),
    },
    create: {
      userId,
      score,
    },
  });
}