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
  const [imageError, setImageError] = useState(false)
  const [fallbackSrc, setFallbackSrc] = useState<string | null>(null)
  const [dimensions, setDimensions] = useState({ width: 400, height: 400 })

  // Reset loading state when image changes
  useEffect(() => {
    setImageLoading(true)
    setImageError(false)
    setFallbackSrc(null)
  }, [image?.url])

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
        {imageLoading && !imageError && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <Skeleton className="h-full w-full" />
              <p className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                Loading image...
              </p>
            </div>
          </div>
        )}
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 p-8 text-center">
            <div>
              <p className="mb-2 text-sm text-red-500">Failed to load image</p>
              <p className="text-xs text-gray-500">
                This might be a temporary issue. Try the next image.
              </p>
            </div>
          </div>
        )}
        {!imageError && (
          <Image
            src={fallbackSrc || image.url}
            alt="Can you tell if this image is AI generated?"
            fill
            sizes="(max-width: 768px) 90vw, (max-width: 1200px) 70vw, 800px"
            className="object-contain"
            priority
            unoptimized
            onLoad={() => {
              setImageLoading(false)
              setImageError(false)
            }}
            onError={(e) => {
              console.error("Image failed to load:", image.url, e)
              // Try a single retry with a stable placeholder if the original URL fails
              if (!fallbackSrc) {
                const seed = encodeURIComponent(image.url)
                setFallbackSrc(`https://picsum.photos/seed/fallback-${seed}/800/800`)
                return
              }
              setImageLoading(false)
              setImageError(true)
            }}
          />
        )}
      </Card>
    </div>
  )
}
