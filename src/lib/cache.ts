const CACHE_PREFIX = "jamsawli-"
const DEFAULT_TTL = 1000 * 60 * 60 // 1 hour

interface CacheEntry<T> {
  data: T
  expiry: number
}

export const cache = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const raw = localStorage.getItem(CACHE_PREFIX + key)
      if (!raw) return null

      const entry: CacheEntry<T> = JSON.parse(raw)
      if (Date.now() > entry.expiry) {
        localStorage.removeItem(CACHE_PREFIX + key)
        return null
      }
      return entry.data
    } catch {
      return null
    }
  },

  async set<T>(key: string, data: T, ttl: number = DEFAULT_TTL): Promise<void> {
    const entry: CacheEntry<T> = {
      data,
      expiry: Date.now() + ttl,
    }
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry))
  },

  async remove(key: string): Promise<void> {
    localStorage.removeItem(CACHE_PREFIX + key)
  },

  async clear(): Promise<void> {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith(CACHE_PREFIX))
    keys.forEach((k) => localStorage.removeItem(k))
  },
}

export const offlineQueue = {
  async add(request: Request): Promise<void> {
    const queue = await cache.get<Request[]>("offline-queue") || []
    queue.push(request)
    await cache.set("offline-queue", queue, 1000 * 60 * 60 * 24 * 7) // 7 days
  },

  async getAll(): Promise<Request[]> {
    return (await cache.get<Request[]>("offline-queue")) || []
  },

  async clear(): Promise<void> {
    await cache.remove("offline-queue")
  },

  async process(): Promise<void> {
    const queue = await this.getAll()
    const remaining: Request[] = []

    for (const request of queue) {
      try {
        await fetch(request)
      } catch {
        remaining.push(request)
      }
    }

    if (remaining.length === 0) {
      await this.clear()
    } else {
      await cache.set("offline-queue", remaining, 1000 * 60 * 60 * 24 * 7)
    }
  },
}
