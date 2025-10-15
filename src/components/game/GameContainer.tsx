"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ImageCard } from "./ImageCard"
import { ChoiceButtons } from "./ChoiceButtons"
import { ScoreDisplay } from "./ScoreDisplay"
import { ResultsOverlay } from "./ResultsOverlay"
import { GameState, GameImage } from "@/types/game"
import { mockImages } from "@/data/mockImages"
import { useUserStats } from "@/hooks/useLocalStorage"
import { useGameSwipe } from "@/hooks/useSwipeGesture"
import { imageApiService } from "@/services/imageApiService"

export function GameContainer() {
  const { stats: savedStats, updateStats } = useUserStats()
  const hasInitialized = useRef(false)
  
  const [gameState, setGameState] = useState<GameState>({
    currentImage: null,
    score: 0, // Initialize with 0, will be updated after hydration
    totalPlayed: 0, // Initialize with 0, will be updated after hydration
    streak: 0, // Streak resets each session
    isLoading: true,
    showResults: false,
    lastChoice: null,
    isCorrect: null,
  })

  // Update game state with saved stats after component mounts (client-side only)
  useEffect(() => {
    if (!hasInitialized.current) {
      setGameState(prev => ({
        ...prev,
        score: savedStats.correctGuesses || 0,
        totalPlayed: savedStats.totalGames || 0,
      }))
      hasInitialized.current = true
    }
  }, [savedStats.correctGuesses, savedStats.totalGames])

  const loadNewImage = useCallback(async () => {
    setGameState((prev) => ({ ...prev, isLoading: true }))

    try {
      const fetchedImage = await imageApiService.getRandomImage()
      const image: GameImage | null = fetchedImage ?? (mockImages.length > 0
        ? mockImages[Math.floor(Math.random() * mockImages.length)]
        : null)

      setGameState((prev) => ({
        ...prev,
        currentImage: image,
        isLoading: false,
        showResults: false,
        lastChoice: null,
        isCorrect: null,
      }))
    } catch (error) {
      console.error("Failed to load image from API:", error)
      const fallbackImage = mockImages.length > 0
        ? mockImages[Math.floor(Math.random() * mockImages.length)]
        : null

      setGameState((prev) => ({
        ...prev,
        currentImage: fallbackImage,
        isLoading: false,
        showResults: false,
        lastChoice: null,
        isCorrect: null,
      }))
    }
  }, [])

  // Load initial image
  useEffect(() => {
    loadNewImage().catch((error) => {
      console.error("Failed to load initial image:", error)
    })
  }, [loadNewImage])

  const handleChoice = async (isAI: boolean) => {
    if (!gameState.currentImage || gameState.showResults) return

    const isCorrect = isAI === gameState.currentImage.isAI
    const newScore = isCorrect ? gameState.score + 1 : gameState.score
    const newStreak = isCorrect ? gameState.streak + 1 : 0
    const newTotalPlayed = gameState.totalPlayed + 1

    // Submit vote to backend
    // try {
    //   await voteService.submitVote({
    //     imageId: gameState.currentImage.id,
    //     choice: isAI ? 'ai' : 'real',
    //     // userId can be added later when user authentication is implemented
    //   })
    // } catch (error) {
    //   console.error('Failed to submit vote:', error)
    //   // Continue with the game even if vote submission fails
    // }

    setGameState((prev) => ({
      ...prev,
      score: newScore,
      totalPlayed: newTotalPlayed,
      streak: newStreak,
      showResults: true,
      lastChoice: isAI,
      isCorrect,
    }))

    // Update saved stats with synchronization to backend
    updateStats({
      totalGames: newTotalPlayed,
      correctGuesses: isCorrect ? savedStats.correctGuesses + 1 : savedStats.correctGuesses,
      bestStreak: Math.max(savedStats.bestStreak, newStreak),
    })
  }

  const handleNext = () => {
    loadNewImage().catch((error) => {
      console.error("Failed to load next image:", error)
    })
  }

  // Setup swipe gestures for mobile
  const swipeHandlers = useGameSwipe({
    onAI: () => handleChoice(true),
    onNotAI: () => handleChoice(false),
    enabled: !gameState.isLoading && !gameState.showResults && !!gameState.currentImage,
  })

  return (
    <div
      className="min-h-screen flex flex-col max-w-6xl mx-auto px-4 py-4"
      {...swipeHandlers}
      style={{ height: "100vh", maxHeight: "100vh", overflow: "auto" }}
    >
      {/* Compact Header */}
      <div className="text-center mb-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
        >
          Is This Photo AI?
        </motion.h1>
        <p className="text-sm text-muted-foreground mt-1">
          Can you tell the difference?
          <span className="md:hidden"> • Swipe right for AI, left for Real</span>
        </p>
      </div>

      {/* Compact Score Display */}
      <div className="mb-4">
        <ScoreDisplay
          score={gameState.score}
          totalPlayed={gameState.totalPlayed}
          streak={gameState.streak}
        />
      </div>

      {/* Image Card - Main Focus */}
      <div className="flex-shrink-0 mb-4">
        <motion.div
          drag={!gameState.showResults && !gameState.isLoading ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
        >
          <ImageCard image={gameState.currentImage} isLoading={gameState.isLoading} />
        </motion.div>
      </div>

      {/* Game Controls - Compact */}
      <div className="flex-shrink-0 mt-auto">
        <AnimatePresence mode="wait">
          {!gameState.showResults ? (
            <motion.div
              key="choices"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ChoiceButtons
                onChoice={handleChoice}
                disabled={gameState.isLoading || !gameState.currentImage}
              />
            </motion.div>
          ) : (
            gameState.currentImage && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <ResultsOverlay
                  image={gameState.currentImage}
                  isCorrect={gameState.isCorrect!}
                  userChoice={gameState.lastChoice!}
                  onNext={handleNext}
                />
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
