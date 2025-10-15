// services/databaseService.ts
import { prisma } from '@/lib/prisma';
import { imageService } from './imageService';
import { GameImage } from '@/types/game';

export class DatabaseService {
  /**
   * Populate the database with images from external sources
   */
  async populateImages(count: number = 50): Promise<void> {
    console.log(`Populating database with ${count} images...`);

    try {
      // Fetch images from external services
      const images = await imageService.fetchMixedImages(count);

      // Process and store each image in the database
      for (const image of images) {
        // Check if image already exists
        const existingImage = await prisma.image.findUnique({
          where: { url: image.url },
        });

        if (!existingImage) {
          // Create new image record
          await prisma.image.create({
            data: {
              url: image.url,
              source: image.source,
              type: image.isAI ? 'ai' : 'real',
              metadata: {
                photographer: image.photographer,
                model: image.model,
                credits: image.credits,
              },
            },
          });
        }
      }

      console.log(`Successfully populated database with ${images.length} new images`);
    } catch (error) {
      console.error('Error populating database:', error);
      throw error;
    }
  }

  /**
   * Get a random image from the database
   */
  async getRandomImage(): Promise<GameImage | null> {
    try {
      // Get total count of images
      const count = await prisma.image.count();
      if (count === 0) return null;

      // Get a random offset
      const randomOffset = Math.floor(Math.random() * count);

      // Fetch the image at the random offset
      const image = await prisma.image.findFirst({
        skip: randomOffset,
        select: {
          id: true,
          url: true,
          source: true,
          type: true,
          metadata: true,
        },
      });

      if (!image) return null;

      // Convert to GameImage format
      return {
        id: image.id,
        url: image.url,
        isAI: image.type === 'ai',
        source: image.source,
        photographer: image.metadata && typeof image.metadata === 'object' && 'photographer' in image.metadata 
          ? image.metadata.photographer as string 
          : undefined,
        model: image.metadata && typeof image.metadata === 'object' && 'model' in image.metadata 
          ? image.metadata.model as string 
          : undefined,
        credits: image.metadata && typeof image.metadata === 'object' && 'credits' in image.metadata 
          ? image.metadata.credits as string 
          : undefined,
      };
    } catch (error) {
      console.error('Error getting random image:', error);
      return null;
    }
  }
}

export const databaseService = new DatabaseService();