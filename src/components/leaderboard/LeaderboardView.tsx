// components/leaderboard/LeaderboardView.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Medal, Crown } from "lucide-react";
import { leaderboardService, LeaderboardEntry, LeaderboardResponse } from "@/services/leaderboardService";

export function LeaderboardView() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await leaderboardService.fetchLeaderboard();
        
        if (data) {
          setLeaderboardData(data);
        } else {
          setError("Failed to load leaderboard data");
        }
      } catch (err) {
        setError("An error occurred while loading the leaderboard");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (error) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-500">
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center gap-4 p-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {leaderboardData?.leaderboard && leaderboardData.leaderboard.length > 0 ? (
              leaderboardData.leaderboard.map((player, index) => (
                <div 
                  key={player.id} 
                  className={`flex items-center gap-4 p-3 rounded-lg ${
                    index === 0 ? "bg-yellow-50 border border-yellow-200" : 
                    index === 1 ? "bg-gray-50 border border-gray-200" : 
                    index === 2 ? "bg-amber-50 border border-amber-200" : 
                    "bg-white border border-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-center w-8">
                    {index === 0 && <Crown className="h-5 w-5 text-yellow-500" />}
                    {index === 1 && <Medal className="h-5 w-5 text-gray-400" />}
                    {index === 2 && <Medal className="h-5 w-5 text-amber-600" />}
                    {index > 2 && (
                      <Badge variant="secondary" className="rounded-full">
                        {index + 1}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {player.username}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {player.totalPlayed} games • {player.accuracy.toFixed(1)}% accuracy
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold">
                      {player.totalScore}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Best streak: {player.bestStreak}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No leaderboard data available yet. Play some games to appear on the leaderboard!
              </div>
            )}
            
            {leaderboardData && leaderboardData.pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {[...Array(leaderboardData.pagination.totalPages)].map((_, index) => (
                  <button
                    key={index}
                    className={`px-3 py-1 rounded ${
                      index + 1 === leaderboardData.pagination.page
                        ? "bg-primary text-primary-foreground"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    onClick={() => {
                      // TODO: Implement pagination
                    }}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}