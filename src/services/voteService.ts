// services/voteService.ts
export interface VoteSubmission {
  imageId: string;
  userId?: string;
  choice: 'ai' | 'real';
}

export interface VoteResponse {
  success: boolean;
  voteId?: string;
  message?: string;
  error?: string;
}

export class VoteService {
  /**
   * Submit a vote for an image
   */
  async submitVote(vote: VoteSubmission): Promise<VoteResponse> {
    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vote),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Error submitting vote:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}

export const voteService = new VoteService();
