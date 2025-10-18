// services/databaseService.ts
import { prisma } from '@/lib/prisma';
import { imageService } from './imageService';
import { GameImage } from '@/types/game';
import crypto from 'crypto';

// Type for image metadata
interface ImageMetadata {
  photographer?: string;
  model?: string;
  credits?: string;
  [key: string]: unknown;
}

// Type for Prisma where clause
interface ImageWhereClause {
  id?: { notIn: string[] };
  url?: { notIn: string[] };
}

export class DatabaseService {
  // Throttle guard to avoid repeated repopulation loops across rapid requests
  private static lastPopulateTimestampMs: number = 0;
  /**
   * Generate a cryptographically secure random number between 0 and 1
   */
  private getSecureRandom(): number {
    const buffer = crypto.randomBytes(4);
    const maxValue = 0xffffffff;
    const randomValue = buffer.readUInt32BE(0);
    return randomValue / maxValue;
  }

  /**
   * Securely shuffle an array using Fisher-Yates algorithm with crypto random
   */
  private secureShuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(this.getSecureRandom() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }
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
   * Mark an image as viewed for a session
   */
  async markImageAsViewed(sessionId: string, imageId: string): Promise<void> {
    try {
      await prisma.viewedImage.upsert({
        where: {
          sessionId_imageId: {
            sessionId,
            imageId,
          },
        },
        update: {
          viewedAt: new Date(),
        },
        create: {
          sessionId,
          imageId,
        },
      });
    } catch (error) {
      console.error('Error marking image as viewed:', error);
    }
  }

  /**
   * Get unviewed images for a session
   * Returns null if there's an error (to distinguish from 0 unviewed images)
   */
  async getUnviewedImagesCount(sessionId: string): Promise<number | null> {
    try {
      const viewedImageIds = await prisma.viewedImage.findMany({
        where: { sessionId },
        select: { imageId: true },
      });
      const viewedIds = viewedImageIds.map((v: { imageId: string }) => v.imageId);

      const unviewedCount = await prisma.image.count({
        where: viewedIds.length > 0 ? { id: { notIn: viewedIds } } : {},
      });
      return Math.max(0, unviewedCount);
    } catch (error) {
      console.error('Error getting unviewed images count:', error);
      // Return null to indicate error, not 0 (which means "all viewed")
      return null;
    }
  }

  /**
   * Get a random unviewed image from the database with truly random selection
   * Only populates new images when user has genuinely seen all available images
   */
  async getRandomImage(sessionId?: string): Promise<GameImage | null> {
    try {
      // Get total count of images
      const totalCount = await prisma.image.count();
      if (totalCount === 0) return null;

      let imagePool: { id: string; url: string; source: string; type: string; metadata: unknown }[] = [];

      if (sessionId) {
        // Check if all images have been viewed
        const unviewedCount = await this.getUnviewedImagesCount(sessionId);

        // If error occurred (null), fall back to fetching all images without tracking
        if (unviewedCount === null) {
          console.warn('Could not get unviewed count, fetching all images');
          imagePool = await prisma.image.findMany({
            select: {
              id: true,
              url: true,
              source: true,
              type: true,
              metadata: true,
            },
          });
        } else if (unviewedCount === 0) {
          // User has truly seen all images - populate more
          const now = Date.now();
          const shouldPopulate = now - DatabaseService.lastPopulateTimestampMs > 5 * 60 * 1000; // 5 minutes

          if (shouldPopulate && totalCount > 0) {
            console.log(`User has viewed all ${totalCount} images. Populating more...`);
            await this.populateImages(50);
            DatabaseService.lastPopulateTimestampMs = now;
          }

          // Fetch all images after potential population
          imagePool = await prisma.image.findMany({
            select: {
              id: true,
              url: true,
              source: true,
              type: true,
              metadata: true,
            },
          });
        } else {
          // Fetch only unviewed images
          const viewedImageIds = await prisma.viewedImage.findMany({
            where: { sessionId },
            select: { imageId: true },
          });

          const viewedIds = viewedImageIds.map((v: { imageId: string }) => v.imageId);

          imagePool = await prisma.image.findMany({
            where: {
              id: {
                notIn: viewedIds,
              },
            },
            select: {
              id: true,
              url: true,
              source: true,
              type: true,
              metadata: true,
            },
          });
        }
      } else {
        // No session tracking, fetch all images
        imagePool = await prisma.image.findMany({
          select: {
            id: true,
            url: true,
            source: true,
            type: true,
            metadata: true,
          },
        });
      }

      if (imagePool.length === 0) return null;

      // Use cryptographically secure random selection
      // This ensures truly random distribution without bias
      const randomIndex = Math.floor(this.getSecureRandom() * imagePool.length);
      const image = imagePool[randomIndex];

      if (!image) return null;

      // Mark as viewed if session is provided
      if (sessionId) {
        await this.markImageAsViewed(sessionId, image.id);
      }

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

  /**
   * Get a random image excluding a list of image IDs
   */
  async getRandomImageExcluding(excludeIds: string[], excludeUrls: string[] = []): Promise<GameImage | null> {
    try {
      const whereClause: ImageWhereClause = {};
      if (excludeIds.length > 0) {
        whereClause.id = { notIn: excludeIds };
      }
      if (excludeUrls.length > 0) {
        whereClause.url = { notIn: excludeUrls };
      }
      const count = await prisma.image.count({ where: whereClause });
      if (count === 0) return null;

      const randomOffset = Math.floor(Math.random() * count);
      const imageList = await prisma.image.findMany({
        where: whereClause,
        skip: randomOffset,
        take: 1,
        select: {
          id: true,
          url: true,
          source: true,
          type: true,
          metadata: true,
        },
      });

      const image = imageList[0];
      if (!image) return null;

      const metadata = image.metadata as ImageMetadata | null;

      return {
        id: image.id,
        url: image.url,
        isAI: image.type === 'ai',
        source: image.source,
        photographer: metadata?.photographer,
        model: metadata?.model,
        credits: metadata?.credits,
      };
    } catch (error) {
      console.error('Error getting random image excluding list:', error);
      return null;
    }
  }
}

export const databaseService = new DatabaseService();