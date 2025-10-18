"use client"

import { AdBanner } from "./AdBanner"

interface AdLayoutProps {
  children: React.ReactNode
}

/**
 * AdLayout Component
 *
 * Wraps page content with ad banners in strategic positions.
 * Desktop: 4 positions (top, bottom, left, right)
 * Mobile: 2 positions (top, bottom)
 */
export function AdLayout({ children }: AdLayoutProps) {
  const adCodes = {
    top: process.env.NEXT_PUBLIC_MONETAG_TOP_AD,
    bottom: process.env.NEXT_PUBLIC_MONETAG_BOTTOM_AD,
    left: process.env.NEXT_PUBLIC_MONETAG_LEFT_AD,
    right: process.env.NEXT_PUBLIC_MONETAG_RIGHT_AD,
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top Ad Banner */}
      <div className="flex w-full justify-center bg-gray-50 py-1 dark:bg-gray-900">
        <AdBanner position="top" adCode={adCodes.top} />
      </div>

      {/* Main Content with Side Ads */}
      <div className="flex flex-1 justify-center">
        {/* Left Ad (Desktop Only) */}
        <div className="hidden items-start justify-center px-2 pt-4 lg:flex">
          <AdBanner position="left" adCode={adCodes.left} className="sticky top-4" />
        </div>

        {/* Main Content */}
        <div className="max-w-7xl flex-1">{children}</div>

        {/* Right Ad (Desktop Only) */}
        <div className="hidden items-start justify-center px-2 pt-4 lg:flex">
          <AdBanner position="right" adCode={adCodes.right} className="sticky top-4" />
        </div>
      </div>

      {/* Bottom Ad Banner */}
      <div className="flex w-full justify-center bg-gray-50 py-1 dark:bg-gray-900">
        <AdBanner position="bottom" adCode={adCodes.bottom} />
      </div>
    </div>
  )
}
