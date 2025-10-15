import { GameContainer } from "@/components/game/GameContainer"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-6">
        <GameContainer />
      </div>
    </main>
  )
}