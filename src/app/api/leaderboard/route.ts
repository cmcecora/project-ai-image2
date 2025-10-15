import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function GET(req: NextRequest) {
  try {
    // Get URL parameters for pagination
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Get the top users by score
    const leaderboard = await prisma.user.findMany({
      orderBy: {
        totalScore: 'desc',
      },
      skip: offset,
      take: limit,
      select: {
        id: true,
        username: true,
        totalScore: true,
        accuracy: true,
        bestStreak: true,
        totalPlayed: true,
      },
    });

    // Calculate total count for pagination
    const totalUsers = await prisma.user.count();

    // Format the response with pagination info
    const response = {
      leaderboard,
      pagination: {
        page,
        limit,
        total: totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
      },
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}