// app/leaderboard/page.tsx
"use client";

import { LeaderboardView } from "@/components/leaderboard/LeaderboardView";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Game
            </Button>
          </Link>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Global Leaderboard
          </h1>
          <p className="text-muted-foreground">
            See how you rank against other players worldwide
          </p>
        </div>
        
        <LeaderboardView />
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Leaderboard updates in real-time as players submit their scores</p>
        </div>
      </div>
    </div>
  );
}