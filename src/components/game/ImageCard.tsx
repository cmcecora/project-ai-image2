"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { GameImage } from "@/types/game"

interface ImageCardProps {
  image: GameImage | null
  isLoading: boolean
}

export function ImageCard({ image, isLoading }: ImageCardProps) {
  const [imageLoading, setImageLoading] = useState(true)
  const [dimensions, setDimensions] = useState({ width: 400, height: 400 })

  useEffect(() => {
    const calculateDimensions = () => {
      // Get viewport dimensions
      const vh = window.innerHeight
      const vw = window.innerWidth

      // Account for UI elements (header, buttons, score display)
      // Roughly 40vh for other elements (header: 10vh, score: 10vh, buttons/results: 20vh)
      const availableHeight = vh * 0.5 // Use 50% of viewport height for image
      const maxWidth = Math.min(vw * 0.9, 800) // Max 90% viewport width or 800px

      // Keep aspect ratio 1:1 (square)
      const size = Math.min(availableHeight, maxWidth)

      setDimensions({ width: size, height: size })
    }

    calculateDimensions()
    window.addEventListener("resize", calculateDimensions)

    return () => window.removeEventListener("resize", calculateDimensions)
  }, [])

  if (isLoading || !image) {
    return (
      <div className="flex justify-center items-center">
        <Card
          className="relative overflow-hidden bg-gray-100"
          style={{
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`,
            maxWidth: "min(90vw, 800px)",
            maxHeight: "50vh"
          }}
        >
          <Skeleton className="h-full w-full" />
        </Card>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center">
      <Card
        className="relative overflow-hidden bg-gray-100 shadow-xl"
        style={{
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
          maxWidth: "min(90vw, 800px)",
          maxHeight: "50vh"
        }}
      >
        {imageLoading && (
          <div className="absolute inset-0 z-10">
            <Skeleton className="h-full w-full" />
          </div>
        )}
        <Image
          src={image.url}
          alt="Can you tell if this image is AI generated?"
          fill
          sizes="(max-width: 768px) 90vw, (max-width: 1200px) 70vw, 800px"
          className="object-contain"
          priority
          onLoad={() => setImageLoading(false)}
          onError={() => setImageLoading(false)}
        />
      </Card>
    </div>
  )
}