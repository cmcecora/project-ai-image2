"use client"

import { useState, useEffect } from "react"

export interface UserStats {
  totalGames: number
  correctGuesses: number
  bestStreak: number
  userId?: string
  lastSync?: string // ISO string date
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  // State to store our value - always start with initialValue to prevent hydration mismatch
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isHydrated, setIsHydrated] = useState(false)

  // Effect to load from localStorage after hydration
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        setStoredValue(JSON.parse(item))
      }
    } catch (error) {
      console.log(error)
    }
    setIsHydrated(true)
  }, [key])

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value
      // Save state
      setStoredValue(valueToStore)
      // Save to local storage only after hydration
      if (isHydrated) {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.log(error)
    }
  }

  return [storedValue, setValue] as const
}

// Enhanced hook for user statistics that includes sync functionality
export function useUserStats() {
  const [stats, setStats] = useLocalStorage<UserStats>("gameStats", {
    totalGames: 0,
    correctGuesses: 0,
    bestStreak: 0,
  })

  // Generate a unique user ID if one doesn't exist
  useEffect(() => {
    if (!stats.userId) {
      const newUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      setStats(prev => ({
        ...prev,
        userId: newUserId
      }))
    }
  }, [stats.userId, setStats])

  // Function to sync local stats to backend
  const syncStats = async () => {
    if (!stats.userId) return

    try {
      const response = await fetch('/api/user/stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: stats.userId,
          totalGames: stats.totalGames,
          correctGuesses: stats.correctGuesses,
          bestStreak: stats.bestStreak,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        // Update the last sync timestamp
        setStats(prev => ({
          ...prev,
          lastSync: new Date().toISOString()
        }))
        return data
      }
    } catch (error) {
      console.error('Error syncing stats:', error)
    }
  }

  // Function to update stats and optionally sync to backend
  const updateStats = (newStats: Partial<UserStats>, syncToBackend: boolean = true) => {
    setStats(prev => {
      const updatedStats = {
        ...prev,
        ...newStats,
        bestStreak: Math.max(prev.bestStreak, newStats.bestStreak || prev.bestStreak)
      }
      return updatedStats
    })

    // Sync to backend if requested
    if (syncToBackend) {
      setTimeout(() => syncStats(), 100) // Delay to allow state update
    }
  }

  return {
    stats,
    updateStats,
    syncStats,
  }
}