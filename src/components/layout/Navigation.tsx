// components/layout/Navigation.tsx
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Trophy, BarChart3 } from "lucide-react"

export function Navigation() {
  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-purple-600" />
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-xl font-bold text-transparent">
              AI or Not?
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link href="/leaderboard">
              <Button variant="ghost" className="gap-2">
                <Trophy className="h-4 w-4" />
                <span className="hidden sm:inline">Leaderboard</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
