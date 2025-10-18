"use client"

import { useEffect, useRef, useState } from "react"

interface AdBannerProps {
  position: "top" | "bottom" | "left" | "right"
  adCode?: string
  className?: string
}

/**
 * AdBanner Component
 *
 * Renders Monetag ad banners in specified positions.
 * Supports desktop and mobile ad formats.
 *
 * @param position - The position of the ad banner (top, bottom, left, right)
 * @param adCode - The Monetag ad code for this position (from env vars)
 * @param className - Additional CSS classes
 */
export function AdBanner({ position, adCode, className = "" }: AdBannerProps) {
  const adContainerRef = useRef<HTMLDivElement>(null)
  const [isAdBlockerDetected, setIsAdBlockerDetected] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Ad blocker detection
  useEffect(() => {
    const detectAdBlocker = async () => {
      try {
        // Simple ad blocker detection
        const testAd = document.createElement("div")
        testAd.innerHTML = "&nbsp;"
        testAd.className = "adsbox"
        testAd.style.position = "absolute"
        testAd.style.left = "-9999px"
        document.body.appendChild(testAd)

        setTimeout(() => {
          const isBlocked = testAd.offsetHeight === 0
          setIsAdBlockerDetected(isBlocked)
          document.body.removeChild(testAd)
        }, 100)
      } catch (error) {
        console.error("Ad blocker detection failed:", error)
      }
    }

    detectAdBlocker()
  }, [])

  // Load Monetag ad script
  useEffect(() => {
    if (!adCode || isAdBlockerDetected) return

    const script = document.createElement("script")
    script.async = true
    script.setAttribute("data-cfasync", "false")
    script.src = `//pl24611234.cpmrevenuegate.com/${adCode}/invoke.js`

    const container = adContainerRef.current
    if (container) {
      container.appendChild(script)
    }

    return () => {
      if (container && script.parentNode) {
        container.removeChild(script)
      }
    }
  }, [adCode, isAdBlockerDetected])

  // Get ad dimensions based on position and device
  const getAdDimensions = () => {
    if (isMobile) {
      return {
        width: "320px",
        height: "40px",
        maxWidth: "100%",
      }
    }

    switch (position) {
      case "top":
      case "bottom":
        return {
          width: "728px",
          height: "60px",
          maxWidth: "100%",
        }
      case "left":
      case "right":
        return {
          width: "160px",
          height: "600px",
        }
      default:
        return {
          width: "100%",
          height: "auto",
        }
    }
  }

  const dimensions = getAdDimensions()

  // Don't render left/right ads on mobile
  if (isMobile && (position === "left" || position === "right")) {
    return null
  }

  // Show polite message if ad blocker detected
  if (isAdBlockerDetected) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-gray-100 p-4 dark:bg-gray-800 ${className}`}
        style={{
          width: dimensions.width,
          height: dimensions.height,
          maxWidth: dimensions.maxWidth,
        }}
      >
        <p className="text-center text-xs text-gray-500">
          Ad blocker detected. Consider supporting us by disabling it! 😊
        </p>
      </div>
    )
  }

  // Show placeholder if no ad code provided
  if (!adCode) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900 ${className}`}
        style={{
          width: dimensions.width,
          height: dimensions.height,
          maxWidth: dimensions.maxWidth,
        }}
      >
        <p className="text-xs text-gray-400">Ad Space - {position}</p>
      </div>
    )
  }

  return (
    <div
      ref={adContainerRef}
      className={`ad-container flex items-center justify-center overflow-hidden ${className}`}
      style={{
        width: dimensions.width,
        height: dimensions.height,
        maxWidth: dimensions.maxWidth,
      }}
      data-ad-position={position}
    />
  )
}
