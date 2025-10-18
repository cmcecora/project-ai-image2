import { GameImage } from "@/types/game"

/**
 * Pick the next unseen image from the provided pool. Returns null when exhausted.
 */
export function selectUnseenImage(
  seenIds: string[],
  pool: GameImage[],
  randomFn: () => number = Math.random
): GameImage | null {
  const unseen = pool.filter((image) => !seenIds.includes(image.id))
  if (unseen.length === 0) {
    return null
  }

  const index = Math.floor(randomFn() * unseen.length)
  return unseen[index] ?? null
}
