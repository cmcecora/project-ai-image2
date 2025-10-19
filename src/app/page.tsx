import { GameContainer } from "@/components/game/GameContainer"
import { AdSlot } from "@/components/ads/AdSlot"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col gap-6">
          {/* Title and subtitle at the very top, centered */}
          <div className="text-center">
            <h1 className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-2xl font-bold text-transparent md:text-3xl lg:text-4xl">
              Is This Photo AI?
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">Can you tell the difference?</p>
          </div>

          {/* Top ad directly under the title */}
          <div className="flex justify-center">
            <AdSlot
              slot="top"
              src="/mockimg/ad1horiz.png"
              alt="Experience premium creative tools"
              className="mx-auto"
            />
          </div>

          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="hidden shrink-0 basis-40 lg:-mt-[175px] lg:flex lg:flex-col">
              <AdSlot
                slot="left"
                src="/mockimg/ad1vert.png"
                alt="Upgrade your workflow today"
                className="lg:min-h-[600px]"
              />
            </div>

            <div className="flex-1">
              <GameContainer />
            </div>

            <div className="hidden shrink-0 basis-40 lg:-mt-[175px] lg:flex lg:flex-col">
              <AdSlot
                slot="right"
                src="/mockimg/ad2vert.gif"
                alt="Discover the future of design"
                className="lg:min-h-[600px]"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
