// services/imageApiService.ts
import { GameImage } from '@/types/game';

export class ImageApiService {
  /**
   * Fetch a random image from the API
   */
  async getRandomImage(): Promise<GameImage | null> {
    try {
      const response = await fetch('/api/images/random');
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to fetch random image: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching random image:', error);
      return null;
    }
  }
}

export const imageApiService = new ImageApiService();
