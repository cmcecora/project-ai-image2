"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, ChevronRight } from "lucide-react"
import { GameImage } from "@/types/game"
import { useEffect, useState } from "react"
import { statsService } from "@/services/statsService"
import { VoteStats } from "@/types/game"
import { StatisticsChart } from "./StatisticsChart"

interface ResultsOverlayProps {
  image: GameImage
  isCorrect: boolean
  onNext: () => void
}

export function ResultsOverlay({ image, isCorrect, onNext }: ResultsOverlayProps) {
  const [stats, setStats] = useState<VoteStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      try {
        const fetchedStats = await statsService.fetchImageStats(image.id)
        if (fetchedStats) {
          setStats(fetchedStats)
        } else {
          // Fallback to default stats if no stats are returned
          setStats({
            imageId: image.id,
            totalVotes: 0,
            aiVotes: 0,
            realVotes: 0,
            aiPercentage: 50,
            realPercentage: 50,
          })
        }
      } catch (error) {
        console.error("Error fetching stats:", error)
        // Fallback to default stats on error
        setStats({
          imageId: image.id,
          totalVotes: 0,
          aiVotes: 0,
          realVotes: 0,
          aiPercentage: 50,
          realPercentage: 50,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [image.id])

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-pulse space-y-4">
              <div className="mx-auto h-6 w-3/4 rounded bg-gray-200"></div>
              <div className="mx-auto h-4 w-1/2 rounded bg-gray-200"></div>
              <div className="mt-6 h-32 rounded bg-gray-200"></div>
              <div className="mt-8 h-10 w-full rounded bg-gray-200"></div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const displayStats = stats || {
    imageId: image.id,
    totalVotes: 0,
    aiVotes: 0,
    realVotes: 0,
    aiPercentage: 50,
    realPercentage: 50,
  }

  const totalVotes = displayStats.totalVotes
  const aiPercentage = displayStats.aiPercentage
  const realPercentage = displayStats.realPercentage

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            {isCorrect ? (
              <>
                <CheckCircle className="h-6 w-6 text-green-600" />
                <span className="text-green-600">Correct!</span>
              </>
            ) : (
              <>
                <XCircle className="h-6 w-6 text-red-600" />
                <span className="text-red-600">Wrong!</span>
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-medium">
              This image is:{" "}
              <span className="font-bold">{image.isAI ? "AI Generated" : "Real"}</span>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {image.isAI ? `Generated with ${image.model}` : `Photo by ${image.photographer}`}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Community Votes</p>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>AI Generated</span>
                <span>{aiPercentage}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full bg-purple-500 transition-all duration-500"
                  style={{ width: `${aiPercentage}%` }}
                />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>Real Photo</span>
                <span>{realPercentage}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full bg-blue-500 transition-all duration-500"
                  style={{ width: `${realPercentage}%` }}
                />
              </div>
            </div>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              {totalVotes.toLocaleString()} votes
            </p>
          </div>

          {/* Add statistics chart when we have data */}
          {stats && stats.totalVotes > 0 && (
            <div className="mt-4">
              <StatisticsChart stats={displayStats} />
            </div>
          )}

          <Button onClick={onNext} className="w-full gap-2" size="lg">
            Next Image
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
