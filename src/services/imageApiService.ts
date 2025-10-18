// services/imageApiService.ts
import { GameImage } from '@/types/game';

export class ImageApiService {
  private sessionId: string | null = null;

  /**
   * Get or create a session ID for tracking viewed images
   */
  private getSessionId(): string {
    if (this.sessionId) {
      return this.sessionId;
    }

    // Check localStorage for existing session ID
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('game-session-id');
      if (stored) {
        this.sessionId = stored;
        return stored;
      }

      // Generate new session ID
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      localStorage.setItem('game-session-id', newSessionId);
      this.sessionId = newSessionId;
      return newSessionId;
    }

    // Fallback for server-side rendering
    return `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  /**
   * Fetch a random image from the API with optional exclude lists
   */
  async getRandomImage(excludeIds: string[] = [], excludeUrls: string[] = []): Promise<GameImage | null> {
    try {
      const sessionId = this.getSessionId();

      // The API currently supports GET with an X-Session-Id header.
      // Exclude lists are handled server-side via session tracking.
      const response = await fetch('/api/images/random', {
        method: 'GET',
        headers: {
          'X-Session-Id': sessionId,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to fetch random image: ${response.status}`);
      }

      const data = await response.json();
      return data as GameImage;
    } catch (error) {
      console.error('Error fetching random image:', error);
      return null;
    }
  }

  /**
   * Ensure an image with this URL exists in the DB; returns DB-backed GameImage
   */
  async ensureImageByUrl(image: GameImage): Promise<GameImage | null> {
    try {
      const response = await fetch('/api/images/ensure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: image.url,
          isAI: image.isAI,
          source: image.source,
          photographer: image.photographer,
          model: image.model,
          credits: image.credits,
        }),
      });
      if (!response.ok) {
        throw new Error(`Failed to ensure image: ${response.status}`);
      }
      const data = await response.json();
      return data as GameImage;
    } catch (error) {
      console.error('Error ensuring image by URL:', error);
      return null;
    }
  }

  /**
   * Reset the session (useful for testing or when user wants to start fresh)
   */
  resetSession(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('game-session-id');
    }
    this.sessionId = null;
  }
}

export const imageApiService = new ImageApiService();
