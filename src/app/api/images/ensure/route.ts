import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/images/ensure
// Ensures an image exists in the DB by URL, returning a DB-backed GameImage
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, isAI, source, photographer, model, credits } = body || {};

    if (!url || typeof url !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid input: url is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Try to find by URL
    const existing = await prisma.image.findUnique({
      where: { url },
      select: { id: true, url: true, source: true, type: true, metadata: true },
    });

    const record = existing
      ? existing
      : await prisma.image.create({
          data: {
            url,
            source: source || 'Unknown',
            type: isAI ? 'ai' : 'real',
            metadata: {
              photographer: photographer,
              model: model,
              credits: credits,
            },
          },
          select: { id: true, url: true, source: true, type: true, metadata: true },
        });

    const responsePayload = {
      id: record.id,
      url: record.url,
      isAI: record.type === 'ai',
      source: record.source,
      photographer:
        record.metadata && typeof record.metadata === 'object' && 'photographer' in record.metadata
          ? (record.metadata as any).photographer
          : undefined,
      model:
        record.metadata && typeof record.metadata === 'object' && 'model' in record.metadata
          ? (record.metadata as any).model
          : undefined,
      credits:
        record.metadata && typeof record.metadata === 'object' && 'credits' in record.metadata
          ? (record.metadata as any).credits
          : undefined,
    };

    return new Response(JSON.stringify(responsePayload), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error ensuring image persistence:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}


