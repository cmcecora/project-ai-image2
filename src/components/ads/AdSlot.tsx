"use client"

import clsx from "clsx"

type AdSlotPosition = "top" | "bottom" | "left" | "right"

interface AdSlotProps {
  slot: AdSlotPosition
  src: string
  alt: string
  href?: string
  className?: string
}

const slotBaseStyles: Record<AdSlotPosition, string> = {
  top: "w-full max-w-[606px] h-[60px] md:h-[68px] lg:h-[75px]",
  bottom: "w-full max-w-[606px] h-[60px] md:h-[68px] lg:h-[75px]",
  left: "w-full h-64 lg:h-full lg:w-40 xl:w-48",
  right: "w-full h-64 lg:h-full lg:w-40 xl:w-48",
}

export function AdSlot({ slot, src, alt, href, className }: AdSlotProps) {
  const content = (
    <figure
      className={clsx(
        "relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-border/60 bg-white shadow-sm",
        slotBaseStyles[slot],
        className
      )}
      data-slot={slot}
      data-testid={`ad-slot-${slot}`}
    >
      <div className="absolute left-2 top-2 rounded bg-black/70 px-2 py-0.5 text-xs font-medium uppercase tracking-wide text-white">
        Advertisement
      </div>
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        loading={slot === "top" ? "eager" : "lazy"}
      />
    </figure>
  )

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    )
  }

  return content
}
