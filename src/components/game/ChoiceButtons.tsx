"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

interface ChoiceButtonsProps {
  onChoice: (isAI: boolean) => void
  disabled: boolean
}

export function ChoiceButtons({ onChoice, disabled }: ChoiceButtonsProps) {
  return (
    <motion.div
      className="flex w-full gap-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <motion.div
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        className="flex-1"
      >
        <Button
          onClick={() => onChoice(true)}
          disabled={disabled}
          className="flex h-12 w-full items-center justify-center gap-2 border-2 border-green-500 bg-green-500/10 text-base font-bold text-green-700 transition-all hover:border-green-600 hover:bg-green-500/20 disabled:opacity-50"
        >
          <Check className="h-5 w-5" />
          <span>YES!</span>
        </Button>
      </motion.div>
      <motion.div
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        className="flex-1"
      >
        <Button
          onClick={() => onChoice(false)}
          disabled={disabled}
          className="flex h-12 w-full items-center justify-center gap-2 border-2 border-red-500 bg-red-500/10 text-base font-bold text-red-700 transition-all hover:border-red-600 hover:bg-red-500/20 disabled:opacity-50"
        >
          <X className="h-5 w-5" />
          <span>NO</span>
        </Button>
      </motion.div>
    </motion.div>
  )
}
