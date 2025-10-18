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
import { useGameSession } from "@/hooks/useGameSession"
import { useGameSwipe } from "@/hooks/useSwipeGesture"
import { imageApiService } from "@/services/imageApiService"
import { voteService } from "@/services/voteService"
import { selectUnseenImage } from "@/lib/imageSelection"

export function GameContainer() {
  const { stats: savedStats, updateStats } = useUserStats()
  const { session, markImageAsSeen, getSeenLists, hasSeenImage } = useGameSession()
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
      setGameState((prev) => ({
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
      // Get current seen lists from session (empty arrays if session not ready yet)
      const { seenImageIds, seenImageUrls } = getSeenLists()

      const fetchedImage = await imageApiService.getRandomImage(seenImageIds, seenImageUrls)
      let image: GameImage | null = null

      // Double-check the image hasn't been seen (race condition protection)
      if (fetchedImage && !hasSeenImage(fetchedImage.id, fetchedImage.url)) {
        image = fetchedImage
      }

      // Fallback to mock images if no API image available
      if (!image) {
        image = selectUnseenImage(seenImageIds, mockImages)
      }

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
      const { seenImageIds } = getSeenLists()
      const fallbackImage = selectUnseenImage(seenImageIds, mockImages)

      setGameState((prev) => ({
        ...prev,
        currentImage: fallbackImage,
        isLoading: false,
        showResults: false,
        lastChoice: null,
        isCorrect: null,
      }))
    }
  }, [getSeenLists, hasSeenImage])

  // Load initial image when component mounts
  useEffect(() => {
    let isMounted = true

    const loadInitialImage = async () => {
      try {
        await loadNewImage()
      } catch (error) {
        if (isMounted) {
          console.error("Failed to load initial image:", error)
        }
      }
    }

    loadInitialImage()

    return () => {
      isMounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty dependency array - only run once on mount, loadNewImage is stable

  const handleChoice = async (isAI: boolean) => {
    if (!gameState.currentImage || gameState.showResults) return

    const isCorrect = isAI === gameState.currentImage.isAI
    const newScore = isCorrect ? gameState.score + 1 : gameState.score
    const newStreak = isCorrect ? gameState.streak + 1 : 0
    const newTotalPlayed = gameState.totalPlayed + 1
    const currentImage = gameState.currentImage
    const currentImageId = currentImage.id

    // Mark image as seen in this session IMMEDIATELY
    markImageAsSeen(currentImageId, currentImage.url)

    // Submit vote to backend (non-blocking)
    ;(async () => {
      try {
        // Ensure the image exists in DB by URL before voting (covers any non-DB images)
        const ensured = await imageApiService.ensureImageByUrl({
          id: currentImageId,
          url: currentImage.url,
          isAI: currentImage.isAI,
          source: currentImage.source,
          photographer: currentImage.photographer,
          model: currentImage.model,
          credits: currentImage.credits,
        })
        const imageIdForVote = ensured?.id || currentImageId
        await voteService.submitVote({
          imageId: imageIdForVote,
          userId: savedStats.userId,
          choice: isAI ? "ai" : "real",
        })
      } catch (error) {
        console.error("Failed to submit vote:", error)
      }
    })()

    setGameState((prev) => ({
      ...prev,
      score: newScore,
      totalPlayed: newTotalPlayed,
      streak: newStreak,
      showResults: true,
      lastChoice: isAI,
      isCorrect,
    }))

    // Update saved stats (for lifetime tracking, not session-based image tracking)
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
      className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-4"
      {...swipeHandlers}
      style={{ height: "100vh", maxHeight: "100vh", overflow: "auto" }}
    >
      {/* Compact Header */}
      <div className="mb-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-2xl font-bold text-transparent md:text-3xl lg:text-4xl"
        >
          Is This Photo AI?
        </motion.h1>
        <p className="mt-1 text-sm text-muted-foreground">
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
      <div className="mb-4 flex flex-shrink-0 flex-col items-center">
        <motion.div
          drag={!gameState.showResults && !gameState.isLoading ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
        >
          <ImageCard image={gameState.currentImage} isLoading={gameState.isLoading} />
        </motion.div>

        {/* Game Controls - Positioned directly below image */}
        <div className="mt-4 w-full" style={{ maxWidth: "min(90vw, 800px)" }}>
          <AnimatePresence mode="wait">
            {!gameState.showResults ? (
              <motion.div
                key="choices"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
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
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
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
    </div>
  )
}
