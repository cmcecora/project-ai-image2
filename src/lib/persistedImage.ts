import { GameImage } from "../types/game"

export interface PersistedImageRecord {
  id: string
  url: string
  source: string
  type: "ai" | "real"
  metadata: unknown
}

export async function selectPersistedImageExcluding(
  candidates: GameImage[],
  excludeIds: string[],
  persist: (candidate: GameImage) => Promise<PersistedImageRecord | null>
): Promise<PersistedImageRecord | null> {
  for (const candidate of candidates) {
    const persisted = await persist(candidate)
    if (!persisted) continue
    if (excludeIds.includes(persisted.id)) {
      continue
    }
    return persisted
  }
  return null
}

export function mapPersistedToGameImage(record: PersistedImageRecord): GameImage {
  const metadata =
    record.metadata && typeof record.metadata === "object"
      ? (record.metadata as Record<string, unknown>)
      : undefined

  return {
    id: record.id,
    url: record.url,
    isAI: record.type === "ai",
    source: record.source,
    photographer:
      metadata && "photographer" in metadata
        ? (metadata.photographer as string | undefined)
        : undefined,
    model: metadata && "model" in metadata ? (metadata.model as string | undefined) : undefined,
    credits:
      metadata && "credits" in metadata ? (metadata.credits as string | undefined) : undefined,
  }
}
