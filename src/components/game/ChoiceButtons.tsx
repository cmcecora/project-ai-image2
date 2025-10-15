"use client"

import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

interface ChoiceButtonsProps {
  onChoice: (isAI: boolean) => void
  disabled: boolean
}

export function ChoiceButtons({ onChoice, disabled }: ChoiceButtonsProps) {
  return (
    <div className="flex gap-2 w-full">
      <Button
        onClick={() => onChoice(true)}
        disabled={disabled}
        size="xl"
        className="flex-1 flex items-center justify-center gap-2 border-2 border-green-500 bg-green-500/10 hover:bg-green-500/20 text-green-700 hover:border-green-600 font-bold text-lg transition-colors"
      >
        <Check className="h-6 w-6" />
        <span>YES!</span>
      </Button>
      <Button
        onClick={() => onChoice(false)}
        disabled={disabled}
        size="xl"
        className="flex-1 flex items-center justify-center gap-2 border-2 border-red-500 bg-red-500/10 hover:bg-red-500/20 text-red-700 hover:border-red-600 font-bold text-lg transition-colors"
      >
        <X className="h-6 w-6" />
        <span>NO</span>
      </Button>
    </div>
  )
}