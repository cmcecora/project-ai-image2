"use client"

import { useSwipeable, SwipeableHandlers } from "react-swipeable"

interface UseGameSwipeProps {
  onAI: () => void
  onNotAI: () => void
  enabled?: boolean
}

export function useGameSwipe({
  onAI,
  onNotAI,
  enabled = true,
}: UseGameSwipeProps): SwipeableHandlers {
  return useSwipeable({
    onSwipedRight: () => {
      if (enabled) onAI()
    },
    onSwipedLeft: () => {
      if (enabled) onNotAI()
    },
    trackMouse: false,
    delta: 50, // minimum swipe distance in pixels
    preventScrollOnSwipe: true,
  })
}