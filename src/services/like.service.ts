// Lightweight like service with localStorage persistence to simulate an API.
export type LikeResult = { key: string; liked: boolean }

const STORAGE_KEY = 'likedImages'

function readStore(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {}
  } catch {
    return {}
  }
}

function writeStore(data: Record<string, boolean>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // ignore write errors
  }
}

export async function toggleLike(key: string, simulateMs = 600): Promise<LikeResult> {
  // simulate network latency
  await new Promise((r) => setTimeout(r, simulateMs))
  const store = readStore()
  const nextValue = !store[key]
  store[key] = nextValue
  writeStore(store)
  return { key, liked: nextValue }
}

export function isLiked(key: string): boolean {
  const store = readStore()
  return !!store[key]
}
