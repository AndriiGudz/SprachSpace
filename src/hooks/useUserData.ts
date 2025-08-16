import { useState, useCallback, useEffect } from 'react'
import { getUserById } from '../api/userApi'

interface UserData {
  id: number
  name: string | null
  nickname: string | null
  surname: string | null
  email: string
  avatar: string | null
  rating: number
  password?: string
  birthdayDate?: string | null
  internalCurrency?: string | null
  status?: boolean
  nativeLanguages?: any[]
  learningLanguages?: any[]
  roles?: any[]
  createdRooms?: any[]
  enabled?: boolean
  username?: string
  authorities?: any[]
  credentialsNonExpired?: boolean
  accountNonExpired?: boolean
  accountNonLocked?: boolean
}

interface UserDataCache {
  [userId: number]: UserData
}

// Глобальные структуры кэша, разделяемые всеми инстансами хука
const GLOBAL_CACHE: UserDataCache = {}
const INFLIGHT = new Map<number, Promise<UserData | null>>()
const LAST_UPDATED: Record<number, number> = {}
const SUBSCRIBERS = new Set<() => void>()
const TTL_MS = 5 * 60 * 1000 // 5 минут

function notifySubscribers() {
  SUBSCRIBERS.forEach((fn) => {
    try {
      fn()
    } catch {}
  })
}

function isFresh(userId: number): boolean {
  const ts = LAST_UPDATED[userId]
  return typeof ts === 'number' && Date.now() - ts < TTL_MS
}

async function fetchAndCache(userId: number): Promise<UserData | null> {
  // Дедупликация параллельных запросов
  if (INFLIGHT.has(userId)) {
    return INFLIGHT.get(userId) as Promise<UserData | null>
  }

  const p = (async () => {
    try {
      const data = await getUserById(userId)
      if (data) {
        GLOBAL_CACHE[userId] = data
        LAST_UPDATED[userId] = Date.now()
        notifySubscribers()
      }
      return data
    } finally {
      INFLIGHT.delete(userId)
    }
  })()

  INFLIGHT.set(userId, p)
  return p
}

export async function prefetchUsers(userIds: number[]): Promise<void> {
  const unique = Array.from(new Set(userIds)).filter(
    (id) => !GLOBAL_CACHE[id] || !isFresh(id)
  )
  if (unique.length === 0) return
  await Promise.allSettled(unique.map((id) => fetchAndCache(id)))
}

export function useUserData() {
  // Локальный тикер, чтобы реагировать на обновления глобального кэша
  const [, setTick] = useState(0)

  useEffect(() => {
    const fn = () => setTick((n) => n + 1)
    SUBSCRIBERS.add(fn)
    return () => {
      SUBSCRIBERS.delete(fn)
    }
  }, [])

  const fetchUserData = useCallback(async (userId: number) => {
    if (GLOBAL_CACHE[userId] && isFresh(userId)) return GLOBAL_CACHE[userId]
    return await fetchAndCache(userId)
  }, [])

  const getUserData = useCallback((userId: number): UserData | null => {
    return GLOBAL_CACHE[userId] || null
  }, [])

  const isUserLoading = useCallback((userId: number): boolean => {
    return INFLIGHT.has(userId)
  }, [])

  return {
    fetchUserData,
    getUserData,
    isUserLoading,
    userCache: GLOBAL_CACHE,
  }
}
