import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';


// GET /api/stats/:imageId
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ imageId: string }> }
) {
  const { imageId } = await params;

  if (!imageId) {
    return new Response(JSON.stringify({ error: 'Image ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Get the stats for the image
    const stats = await prisma.stat.findUnique({
      where: { imageId },
    });

    if (!stats) {
      return new Response(JSON.stringify({ error: 'Stats not found for this image' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      imageId: stats.imageId,
      totalVotes: stats.totalVotes,
      aiVotes: stats.aiVotes,
      realVotes: stats.realVotes,
      aiPercentage: stats.aiPercentage,
      realPercentage: stats.realPercentage,
      lastUpdated: stats.lastUpdated,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching image stats:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}