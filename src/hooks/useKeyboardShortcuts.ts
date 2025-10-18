"use client"

import { useEffect } from 'react'

interface KeyboardShortcutHandlers {
  onLeftArrow?: () => void
  onRightArrow?: () => void
  onSpace?: () => void
  onEnter?: () => void
  onEscape?: () => void
  onY?: () => void  // Yes (AI)
  onN?: () => void  // No (Real)
}

/**
 * Custom hook for keyboard shortcuts
 * @param handlers - Object containing callback functions for different key presses
 * @param enabled - Whether keyboard shortcuts are enabled (default: true)
 */
export function useKeyboardShortcuts(handlers: KeyboardShortcutHandlers, enabled = true) {
  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      const key = event.key.toLowerCase()

      switch (key) {
        case 'arrowleft':
          event.preventDefault()
          handlers.onLeftArrow?.()
          break
        case 'arrowright':
          event.preventDefault()
          handlers.onRightArrow?.()
          break
        case ' ':
          event.preventDefault()
          handlers.onSpace?.()
          break
        case 'enter':
          event.preventDefault()
          handlers.onEnter?.()
          break
        case 'escape':
          event.preventDefault()
          handlers.onEscape?.()
          break
        case 'y':
          event.preventDefault()
          handlers.onY?.()
          break
        case 'n':
          event.preventDefault()
          handlers.onN?.()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handlers, enabled])
}

