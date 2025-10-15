// services/statsService.ts
import { VoteStats } from '@/types/game';

export class StatsService {
  /**
   * Fetch statistics for a specific image
   */
  async fetchImageStats(imageId: string): Promise<VoteStats | null> {
    try {
      const response = await fetch(`/api/stats/${imageId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          // If stats don't exist yet, return default values
          return {
            imageId,
            totalVotes: 0,
            aiVotes: 0,
            realVotes: 0,
            aiPercentage: 50,
            realPercentage: 50,
          };
        }
        throw new Error(`Failed to fetch stats: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        imageId: data.imageId,
        totalVotes: data.totalVotes,
        aiVotes: data.aiVotes,
        realVotes: data.realVotes,
        aiPercentage: data.aiPercentage,
        realPercentage: data.realPercentage,
      };
    } catch (error) {
      console.error('Error fetching image stats:', error);
      return null;
    }
  }
}

export const statsService = new StatsService();