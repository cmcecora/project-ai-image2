"use client"

import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

interface ChoiceButtonsProps {
  onChoice: (isAI: boolean) => void
  disabled: boolean
}

export function ChoiceButtons({ onChoice, disabled }: ChoiceButtonsProps) {
  return (
    <div className="flex w-full gap-3">
      <Button
        onClick={() => onChoice(true)}
        disabled={disabled}
        className="flex h-14 flex-1 items-center justify-center gap-2 border-2 border-green-500 bg-green-500/10 text-lg font-bold text-green-700 transition-all hover:border-green-600 hover:bg-green-500/20 disabled:opacity-50"
      >
        <Check className="h-6 w-6" />
        <span>YES!</span>
      </Button>
      <Button
        onClick={() => onChoice(false)}
        disabled={disabled}
        className="flex h-14 flex-1 items-center justify-center gap-2 border-2 border-red-500 bg-red-500/10 text-lg font-bold text-red-700 transition-all hover:border-red-600 hover:bg-red-500/20 disabled:opacity-50"
      >
        <X className="h-6 w-6" />
        <span>NO</span>
      </Button>
    </div>
  )
}
