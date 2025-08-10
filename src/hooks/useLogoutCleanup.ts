import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'

export function useLogoutCleanup() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  )
  const userId = useSelector((state: RootState) => state.user.id)

  useEffect(() => {
    console.log('🧹 useLogoutCleanup effect triggered:', {
      isAuthenticated,
      userId,
      timestamp: new Date().toISOString(),
    })

    // Если пользователь разлогинился, очищаем все записи об онлайн статусе
    if (!isAuthenticated && userId) {
      console.log('🧹 User logged out, cleaning up online status records')

      // Очищаем все записи в localStorage связанные с онлайн статусом этого пользователя
      const keysToRemove: string[] = []

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(`room_online_${userId}_`)) {
          keysToRemove.push(key)
        }
      }

      keysToRemove.forEach((key) => {
        localStorage.removeItem(key)
        console.log(`🗑️ Removed online status record: ${key}`)
      })
    }
  }, [isAuthenticated, userId])
}
