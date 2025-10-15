// services/leaderboardService.ts
export interface LeaderboardEntry {
  id: string;
  username: string;
  totalScore: number;
  accuracy: number;
  bestStreak: number;
  totalPlayed: number;
  rank?: number;
}

export interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class LeaderboardService {
  /**
   * Fetch leaderboard data
   */
  async fetchLeaderboard(page: number = 1, limit: number = 10): Promise<LeaderboardResponse | null> {
    try {
      const response = await fetch(`/api/leaderboard?page=${page}&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch leaderboard: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        leaderboard: data.leaderboard.map((entry: { id: string; username: string; totalScore: number; accuracy: number; bestStreak: number; totalPlayed: number; rank: number }) => ({
          id: entry.id,
          username: entry.username,
          totalScore: entry.totalScore,
          accuracy: entry.accuracy,
          bestStreak: entry.bestStreak,
          totalPlayed: entry.totalPlayed,
          rank: entry.rank,
        })),
        pagination: {
          page: data.pagination.page,
          limit: data.pagination.limit,
          total: data.pagination.total,
          totalPages: data.pagination.totalPages,
        },
      };
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return null;
    }
  }
}

export const leaderboardService = new LeaderboardService();