import { useState, useCallback } from 'react'
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

export function useUserData() {
  const [userCache, setUserCache] = useState<UserDataCache>({})
  const [loadingUsers, setLoadingUsers] = useState<Set<number>>(new Set())

  const fetchUserData = useCallback(
    async (userId: number): Promise<UserData | null> => {
      // Если данные уже в кэше, возвращаем их
      if (userCache[userId]) {
        return userCache[userId]
      }

      // Если уже загружаем этого пользователя, не делаем повторный запрос
      if (loadingUsers.has(userId)) {
        return null
      }

      try {
        setLoadingUsers((prev) => new Set(prev).add(userId))

        const userData = await getUserById(userId)

        if (userData) {
          // Кэшируем данные пользователя
          setUserCache((prev) => ({
            ...prev,
            [userId]: userData,
          }))
        }

        return userData
      } catch (error) {
        console.error(`Error fetching user data for ID ${userId}:`, error)
        return null
      } finally {
        setLoadingUsers((prev) => {
          const newSet = new Set(prev)
          newSet.delete(userId)
          return newSet
        })
      }
    },
    [userCache, loadingUsers]
  )

  const getUserData = useCallback(
    (userId: number): UserData | null => {
      return userCache[userId] || null
    },
    [userCache]
  )

  const isUserLoading = useCallback(
    (userId: number): boolean => {
      return loadingUsers.has(userId)
    },
    [loadingUsers]
  )

  return {
    fetchUserData,
    getUserData,
    isUserLoading,
    userCache,
  }
}
