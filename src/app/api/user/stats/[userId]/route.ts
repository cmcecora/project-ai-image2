import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;

  if (!userId) {
    return new Response(JSON.stringify({ error: 'User ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!userId) {
    return new Response(JSON.stringify({ error: 'User ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        totalScore: true,
        accuracy: true,
        bestStreak: true,
        totalPlayed: true,
        createdAt: true,
      },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      userId: user.id,
      username: user.username,
      totalScore: user.totalScore,
      accuracy: user.accuracy,
      bestStreak: user.bestStreak,
      totalPlayed: user.totalPlayed,
      createdAt: user.createdAt,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}