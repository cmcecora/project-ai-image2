// components/game/StatisticsDisplay.tsx
"use client"

import { VoteStats } from "@/types/game"
import { StatisticsChart } from "./StatisticsChart"

interface StatisticsDisplayProps {
  stats: VoteStats
}

export function StatisticsDisplay({ stats }: StatisticsDisplayProps) {
  const { totalVotes, aiPercentage, realPercentage } = stats

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">AI Generated</span>
            <span className="font-bold">{aiPercentage}%</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-purple-500 transition-all duration-500 ease-out"
              style={{ width: `${aiPercentage}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Real Photo</span>
            <span className="font-bold">{realPercentage}%</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-blue-500 transition-all duration-500 ease-out"
              style={{ width: `${realPercentage}%` }}
            />
          </div>
        </div>

        <p className="mt-2 text-center text-xs text-muted-foreground">
          {totalVotes.toLocaleString()} total votes
        </p>
      </div>

      {totalVotes > 0 && (
        <div className="mt-4">
          <StatisticsChart stats={stats} />
        </div>
      )}
    </div>
  )
}
