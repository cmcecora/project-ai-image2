import { databaseService } from '@/services/databaseService';
import { imageService } from '@/services/imageService';
import { headers } from 'next/headers';

// GET /api/images/random
export async function GET(request: Request) {
  let randomImage = null;

  // Get or create session ID from cookie or header
  const headersList = await headers();
  const sessionId = headersList.get('x-session-id') ||
                    request.headers.get('x-session-id') ||
                    `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

  try {
    randomImage = await databaseService.getRandomImage(sessionId);
  } catch (error) {
    console.error('Error fetching image from database:', error);
  }

  // Fallback to live third-party APIs if the database does not return an image
  if (!randomImage) {
    try {
      const images = await imageService.fetchMixedImages(1);
      randomImage = images[0] ?? null;
    } catch (error) {
      console.error('Error fetching image from third-party services:', error);
    }
  }

  if (!randomImage) {
    return new Response(JSON.stringify({ error: 'No images available' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    return new Response(JSON.stringify(randomImage), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
        'X-Session-Id': sessionId,
      },
    });
  } catch (error) {
    console.error('Error serializing image response:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
