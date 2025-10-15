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
   * Fetch a random image from the API with session tracking
   */
  async getRandomImage(): Promise<GameImage | null> {
    try {
      const sessionId = this.getSessionId();

      const response = await fetch('/api/images/random', {
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

      // Update session ID from response if provided
      const returnedSessionId = response.headers.get('X-Session-Id');
      if (returnedSessionId && typeof window !== 'undefined') {
        this.sessionId = returnedSessionId;
        localStorage.setItem('game-session-id', returnedSessionId);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching random image:', error);
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
