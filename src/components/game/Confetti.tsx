"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface ConfettiProps {
  isSuccess: boolean
}

interface ConfettiPiece {
  id: number
  x: number
  y: number
  rotation: number
  color: string
  size: number
  delay: number
}

export function Confetti({ isSuccess }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    if (!isSuccess) return

    // Generate confetti pieces
    const newPieces: ConfettiPiece[] = []
    const colors = isSuccess 
      ? ["#10b981", "#34d399", "#6ee7b7", "#fbbf24", "#fcd34d"]  // Success colors (green/gold)
      : ["#ef4444", "#f87171", "#fca5a5", "#fb923c", "#fdba74"]  // Failure colors (red/orange)

    for (let i = 0; i < 50; i++) {
      newPieces.push({
        id: i,
        x: Math.random() * 100,
        y: -10,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 10 + 5,
        delay: Math.random() * 0.3,
      })
    }

    setPieces(newPieces)

    // Clean up after animation
    const timer = setTimeout(() => setPieces([]), 3000)
    return () => clearTimeout(timer)
  }, [isSuccess])

  if (pieces.length === 0) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{
            x: `${piece.x}vw`,
            y: piece.y,
            rotate: piece.rotation,
            opacity: 1,
          }}
          animate={{
            y: "110vh",
            rotate: piece.rotation + 720,
            opacity: 0,
          }}
          transition={{
            duration: 2.5 + Math.random(),
            delay: piece.delay,
            ease: "easeIn",
          }}
          style={{
            position: "absolute",
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "0%",
          }}
        />
      ))}
    </div>
  )
}

