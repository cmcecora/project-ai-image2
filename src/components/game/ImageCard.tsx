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

// Helper function to determine if URL is a video
function isVideoUrl(url: string): boolean {
  const videoExtensions = /\.(mp4|webm|ogg|mov|avi|mkv|m4v)$/i
  return videoExtensions.test(url)
}

// Helper function to determine if URL is an image
function isImageUrl(url: string): boolean {
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|avif|bmp|svg)$/i
  return imageExtensions.test(url)
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
      <div className="flex items-center justify-center">
        <Card
          className="relative overflow-hidden bg-gray-100"
          style={{
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`,
            maxWidth: "min(90vw, 800px)",
            maxHeight: "50vh",
          }}
        >
          <Skeleton className="h-full w-full" />
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center">
      <Card
        className="relative overflow-hidden bg-gray-100 shadow-xl"
        style={{
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
          maxWidth: "min(90vw, 800px)",
          maxHeight: "50vh",
        }}
      >
        {imageLoading && (
          <div className="absolute inset-0 z-10">
            <Skeleton className="h-full w-full" />
          </div>
        )}

        {/* Render video if URL is a video */}
        {isVideoUrl(image.url) ? (
          <video
            src={image.url}
            className="h-full w-full object-contain"
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
          />
        ) : (
          /* Render image if URL is an image */
          <Image
            src={image.url}
            alt="Can you tell if this image is AI generated?"
            fill
            sizes="(max-width: 768px) 90vw, (max-width: 1200px) 70vw, 800px"
            className="object-contain"
            priority
            unoptimized
            onLoad={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
          />
        )}
      </Card>
    </div>
  )
}
