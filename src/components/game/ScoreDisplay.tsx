"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Target, Zap } from "lucide-react"

interface ScoreDisplayProps {
  score: number
  totalPlayed: number
  streak: number
}

export function ScoreDisplay({ score, totalPlayed, streak }: ScoreDisplayProps) {
  const accuracy = totalPlayed > 0 ? Math.round((score / totalPlayed) * 100) : 0

  return (
    <div className="grid grid-cols-3 gap-2 md:gap-4">
      <Card>
        <CardContent className="flex items-center justify-center p-2 md:p-3">
          <div className="text-center">
            <Trophy className="mx-auto mb-0.5 h-4 w-4 md:h-5 md:w-5 text-yellow-600" />
            <div className="text-lg md:text-2xl font-bold">{score}</div>
            <div className="text-[10px] md:text-xs text-muted-foreground">Score</div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center justify-center p-2 md:p-3">
          <div className="text-center">
            <Target className="mx-auto mb-0.5 h-4 w-4 md:h-5 md:w-5 text-green-600" />
            <div className="text-lg md:text-2xl font-bold">{accuracy}%</div>
            <div className="text-[10px] md:text-xs text-muted-foreground">Accuracy</div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center justify-center p-2 md:p-3">
          <div className="text-center">
            <Zap className="mx-auto mb-0.5 h-4 w-4 md:h-5 md:w-5 text-orange-600" />
            <div className="text-lg md:text-2xl font-bold">{streak}</div>
            <div className="text-[10px] md:text-xs text-muted-foreground">Streak</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}