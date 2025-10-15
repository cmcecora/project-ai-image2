export interface GameImage {
  id: string
  url: string
  isAI: boolean
  source: string
  credits?: string
  photographer?: string
  model?: string
}

export interface GameState {
  currentImage: GameImage | null
  score: number
  totalPlayed: number
  streak: number
  isLoading: boolean
  showResults: boolean
  lastChoice: boolean | null
  isCorrect: boolean | null
}

export interface VoteStats {
  imageId: string
  totalVotes: number
  aiVotes: number
  realVotes: number
  aiPercentage: number
  realPercentage: number
}

export interface UserStats {
  userId: string
  totalGames: number
  correctGuesses: number
  accuracy: number
  currentStreak: number
  bestStreak: number
  lastPlayed?: Date
}