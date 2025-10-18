"use client"

import { useState, useEffect, useRef, useCallback } from "react"

export interface GameSession {
  sessionId: string
  startedAt: string
  seenImageIds: string[]
  seenImageUrls: string[]
}

/**
 * Hook to manage game session state
 * A session is unique per page load and tracks which images have been shown
 * This prevents the same image from appearing twice in a single session
 */
export function useGameSession() {
  const [session, setSession] = useState<GameSession | null>(null)
  const sessionRef = useRef<GameSession | null>(null)

  // Initialize session on mount
  useEffect(() => {
    const newSession: GameSession = {
      sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      startedAt: new Date().toISOString(),
      seenImageIds: [],
      seenImageUrls: [],
    }
    setSession(newSession)
    sessionRef.current = newSession
  }, [])

  // Add an image to the session's seen list
  const markImageAsSeen = useCallback((imageId: string, imageUrl: string) => {
    setSession((prev) => {
      if (!prev) return prev

      const updated = {
        ...prev,
        seenImageIds: Array.from(new Set([...prev.seenImageIds, imageId])),
        seenImageUrls: Array.from(new Set([...prev.seenImageUrls, imageUrl])),
      }

      // Update ref immediately for synchronous access
      sessionRef.current = updated

      return updated
    })
  }, [])

  // Get current seen lists (synchronous access)
  const getSeenLists = useCallback(() => {
    return {
      seenImageIds: sessionRef.current?.seenImageIds || [],
      seenImageUrls: sessionRef.current?.seenImageUrls || [],
    }
  }, [])

  // Check if an image has been seen in this session
  const hasSeenImage = useCallback((imageId: string, imageUrl: string) => {
    if (!sessionRef.current) return false
    return (
      sessionRef.current.seenImageIds.includes(imageId) ||
      sessionRef.current.seenImageUrls.includes(imageUrl)
    )
  }, [])

  return {
    session,
    sessionRef,
    markImageAsSeen,
    getSeenLists,
    hasSeenImage,
  }
}
