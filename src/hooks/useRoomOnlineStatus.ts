import { useEffect, useRef, useCallback, useState } from 'react'

interface UseRoomOnlineStatusOptions {
  roomId?: number
  userId?: number | null
  isAuthenticated: boolean
  enabled?: boolean // Позволяет отключить хук
}

export function useRoomOnlineStatus({
  roomId,
  userId,
  isAuthenticated,
  enabled = true,
}: UseRoomOnlineStatusOptions) {
  const hasJoinedRef = useRef(false)
  const currentRoomIdRef = useRef<number | null>(null)
  const currentUserIdRef = useRef<number | null>(null)
  const isAuthenticatedRef = useRef(isAuthenticated)
  const [isOnline, setIsOnline] = useState(false)
  const tabIdRef = useRef(Math.random().toString(36).substr(2, 9)) // Уникальный ID вкладки

  // Обновляем refs при изменении значений
  useEffect(() => {
    isAuthenticatedRef.current = isAuthenticated
    currentUserIdRef.current = userId || null
  }, [isAuthenticated, userId])

  // Функция для присоединения к онлайн статусу
  const joinOnline = useCallback(async (roomId: number, userId: number) => {
    try {
      console.log('🔍 Checking if can join room online:', {
        roomId,
        userId,
        tabId: tabIdRef.current,
        localStorageKey: `room_online_${userId}_${roomId}`,
        timestamp: new Date().toISOString(),
      })

      // Проверяем, не активна ли уже другая вкладка ЭТОГО ЖЕ пользователя
      const activeTabData = localStorage.getItem(
        `room_online_${userId}_${roomId}`
      )
      if (activeTabData) {
        try {
          const { tabId, timestamp } = JSON.parse(activeTabData)
          const isExpired = Date.now() - timestamp > 30000 // 30 секунд

          if (!isExpired && tabId !== tabIdRef.current) {
            console.log(
              '⚠️ Another tab is already active for this user in this room, skipping join',
              {
                userId,
                roomId,
                activeTabId: tabId,
                currentTabId: tabIdRef.current,
                timestamp: new Date(timestamp).toISOString(),
              }
            )
            return false
          }
        } catch (e) {
          console.log('Error parsing active tab data:', e)
        }
      }

      const url = `http://localhost:8080/api/room/online?userId=${userId}&roomId=${roomId}`

      console.log('🟢 Sending POST request to join room online:', {
        roomId,
        userId,
        tabId: tabIdRef.current,
        url,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      // Попробуем прочитать тело ответа
      let responseBody = null
      try {
        const responseText = await response.text()
        if (responseText) {
          responseBody = responseText
          try {
            responseBody = JSON.parse(responseText)
          } catch (e) {
            // Оставляем как текст если не JSON
          }
        }
      } catch (e) {
        console.log('Could not read response body:', e)
      }

      console.log('📡 POST response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        body: responseBody,
      })

      if (response.ok || response.status === 409) {
        // 409 означает что пользователь уже онлайн - это нормально
        console.log('✅ Successfully joined room online', {
          status: response.status,
          roomId,
          userId,
          responseBody,
        })

        // Проверим данные сразу после успешного запроса
        console.log('🔍 Checking room data immediately after POST...')
        try {
          const checkResponse = await fetch(
            `http://localhost:8080/api/room/id?roomId=${roomId}`
          )
          if (checkResponse.ok) {
            const roomData = await checkResponse.json()
            console.log('📊 Room data immediately after POST:', {
              roomId: roomData.id,
              countOnlineUser: roomData.countOnlineUser,
              roomOnlineUsers: roomData.roomOnlineUsers?.length || 0,
              roomOnlineUsersData: roomData.roomOnlineUsers,
            })
          }
        } catch (e) {
          console.log('❌ Error checking room data:', e)
        }

        hasJoinedRef.current = true
        currentRoomIdRef.current = roomId
        currentUserIdRef.current = userId
        setIsOnline(true)

        // Регистрируем эту вкладку как активную
        const key = `room_online_${userId}_${roomId}`
        const data = {
          tabId: tabIdRef.current,
          timestamp: Date.now(),
        }
        localStorage.setItem(key, JSON.stringify(data))

        return true
      } else {
        console.error('❌ Failed to join room online:', {
          status: response.status,
          statusText: response.statusText,
          responseBody,
        })
        return false
      }
    } catch (error) {
      console.error('❌ Error joining room online:', error)
      return false
    }
  }, [])

  // Функция для выхода из онлайн статуса
  const leaveOnline = useCallback(async (forceBeacon = false) => {
    console.log('🔴 leaveOnline called:', {
      hasJoinedRef: hasJoinedRef.current,
      currentRoomIdRef: currentRoomIdRef.current,
      currentUserIdRef: currentUserIdRef.current,
      stackTrace: new Error().stack,
    })

    if (
      !hasJoinedRef.current ||
      !currentRoomIdRef.current ||
      !currentUserIdRef.current
    ) {
      console.log('❌ leaveOnline: conditions not met, skipping')
      return
    }

    try {
      console.log('🔴 Leaving room online:', {
        roomId: currentRoomIdRef.current,
        userId: currentUserIdRef.current,
        timestamp: new Date().toISOString(),
      })

      // Используем sendBeacon для надежной отправки при закрытии страницы
      const data = JSON.stringify({
        userId: currentUserIdRef.current,
        roomId: currentRoomIdRef.current,
      })

      const url = `http://localhost:8080/api/room/online?userId=${currentUserIdRef.current}&roomId=${currentRoomIdRef.current}`

      console.log('🔧 DELETE request details:', {
        url,
        method: 'DELETE',
        data,
        hasBeacon: !!navigator.sendBeacon,
        forceBeacon,
        timestamp: new Date().toISOString(),
      })

      // Используем sendBeacon только при принудительном вызове (закрытие страницы)
      if (forceBeacon && navigator.sendBeacon) {
        console.log('📡 Attempting sendBeacon DELETE:', {
          url,
          data,
          timestamp: new Date().toISOString(),
        })

        const success = navigator.sendBeacon(
          url,
          new Blob([data], { type: 'application/json' })
        )

        console.log('📡 sendBeacon result:', {
          success,
          timestamp: new Date().toISOString(),
        })

        if (success) {
          console.log('✅ Successfully sent sendBeacon DELETE request')

          // sendBeacon не позволяет читать ответ, но проверим данные через короткое время
          setTimeout(async () => {
            try {
              console.log('🔍 Checking room data after sendBeacon DELETE...')
              const checkResponse = await fetch(
                `http://localhost:8080/api/room/id?roomId=${currentRoomIdRef.current}`
              )
              if (checkResponse.ok) {
                const roomData = await checkResponse.json()
                console.log('📊 Room data after sendBeacon DELETE:', {
                  roomId: roomData.id,
                  countOnlineUser: roomData.countOnlineUser,
                  roomOnlineUsers: roomData.roomOnlineUsers?.length || 0,
                  roomOnlineUsersData: roomData.roomOnlineUsers,
                })
              }
            } catch (e) {
              console.log('❌ Error checking room data after sendBeacon:', e)
            }
          }, 1000) // Проверяем через 1 секунду

          hasJoinedRef.current = false
          currentRoomIdRef.current = null
          setIsOnline(false)
          return
        } else {
          console.log('❌ sendBeacon failed, trying fetch')
        }
      }

      // Fallback на обычный fetch
      console.log('📡 Attempting fetch DELETE:', {
        url,
        method: 'DELETE',
        data,
      })
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data,
      })

      // Попробуем прочитать тело ответа DELETE
      let responseBody = null
      try {
        const responseText = await response.text()
        if (responseText) {
          responseBody = responseText
          try {
            responseBody = JSON.parse(responseText)
          } catch (e) {
            // Оставляем как текст если не JSON
          }
        }
      } catch (e) {
        console.log('Could not read DELETE response body:', e)
      }

      console.log('📡 DELETE response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        body: responseBody,
        headers: Object.fromEntries(response.headers.entries()),
      })

      if (response.ok) {
        console.log('✅ Successfully left room online via fetch', {
          responseBody,
        })

        // Проверим данные сразу после успешного DELETE запроса
        console.log('🔍 Checking room data immediately after DELETE...')
        try {
          const checkResponse = await fetch(
            `http://localhost:8080/api/room/id?roomId=${currentRoomIdRef.current}`
          )
          if (checkResponse.ok) {
            const roomData = await checkResponse.json()
            console.log('📊 Room data immediately after DELETE:', {
              roomId: roomData.id,
              countOnlineUser: roomData.countOnlineUser,
              roomOnlineUsers: roomData.roomOnlineUsers?.length || 0,
              roomOnlineUsersData: roomData.roomOnlineUsers,
            })
          }
        } catch (e) {
          console.log('❌ Error checking room data after DELETE:', e)
        }
      } else {
        console.error('❌ Failed to leave room online:', {
          status: response.status,
          statusText: response.statusText,
          responseBody,
        })
      }
    } catch (error) {
      console.error('❌ Error leaving room online:', error)
    } finally {
      hasJoinedRef.current = false

      // Убираем регистрацию активной вкладки
      if (currentRoomIdRef.current && currentUserIdRef.current) {
        const key = `room_online_${currentUserIdRef.current}_${currentRoomIdRef.current}`
        const activeTabData = localStorage.getItem(key)

        if (activeTabData) {
          try {
            const { tabId } = JSON.parse(activeTabData)
            // Удаляем только если это наша вкладка
            if (tabId === tabIdRef.current) {
              localStorage.removeItem(key)
            }
          } catch (e) {
            // Игнорируем ошибки парсинга
          }
        }
      }

      currentRoomIdRef.current = null
      setIsOnline(false)
    }
  }, [])

  // Сохраняем предыдущие значения для сравнения
  const prevValuesRef = useRef({ enabled, roomId, userId, isAuthenticated })

  // Присоединяемся к онлайн статусу при монтировании/изменении параметров
  useEffect(() => {
    const prevValues = prevValuesRef.current
    const currentValues = { enabled, roomId, userId, isAuthenticated }

    console.log('🎯 useRoomOnlineStatus main useEffect triggered:', {
      ...currentValues,
      hasJoinedRef: hasJoinedRef.current,
      currentRoomIdRef: currentRoomIdRef.current,
      timestamp: new Date().toISOString(),
      // Показываем что изменилось
      changes: {
        enabled: prevValues.enabled !== enabled,
        roomId: prevValues.roomId !== roomId,
        userId: prevValues.userId !== userId,
        isAuthenticated: prevValues.isAuthenticated !== isAuthenticated,
      },
    })

    // Обновляем предыдущие значения
    prevValuesRef.current = currentValues

    if (!enabled || !roomId || !userId || userId === null || !isAuthenticated) {
      console.log(
        '❌ Conditions not met for joining room online:',
        currentValues
      )
      return
    }

    // Проверяем, не присоединились ли мы уже к этой комнате
    if (hasJoinedRef.current && currentRoomIdRef.current === roomId) {
      console.log('✅ Already joined this room, skipping')
      return
    }

    // Если мы были в другой комнате, сначала выходим
    if (hasJoinedRef.current && currentRoomIdRef.current !== roomId) {
      console.log('🔄 Switching rooms, leaving previous room first:', {
        previousRoomId: currentRoomIdRef.current,
        newRoomId: roomId,
      })
      leaveOnline(false) // НЕ используем sendBeacon при смене комнат
    }

    // Присоединяемся к новой комнате
    console.log('🚀 Attempting to join room online')
    joinOnline(roomId, userId)
  }, [enabled, roomId, userId, isAuthenticated, joinOnline, leaveOnline]) // Возвращаем зависимости

  // Периодически обновляем timestamp для активной вкладки
  useEffect(() => {
    if (
      !hasJoinedRef.current ||
      !currentRoomIdRef.current ||
      !currentUserIdRef.current
    ) {
      return
    }

    const interval = setInterval(() => {
      if (
        hasJoinedRef.current &&
        currentRoomIdRef.current &&
        currentUserIdRef.current
      ) {
        const key = `room_online_${currentUserIdRef.current}_${currentRoomIdRef.current}`
        const data = {
          tabId: tabIdRef.current,
          timestamp: Date.now(),
        }
        localStorage.setItem(key, JSON.stringify(data))
      }
    }, 10000) // Обновляем каждые 10 секунд

    return () => clearInterval(interval)
  }, [])

  // Выходим при размонтировании компонента
  useEffect(() => {
    console.log('🔧 useRoomOnlineStatus cleanup useEffect mounted')
    return () => {
      console.log(
        '🔧 useRoomOnlineStatus cleanup triggered (component unmounting):',
        {
          hasJoinedRef: hasJoinedRef.current,
          timestamp: new Date().toISOString(),
        }
      )
      if (hasJoinedRef.current) {
        console.log('🔧 Calling leaveOnline from cleanup (using fetch)')
        leaveOnline(false) // НЕ используем sendBeacon при контролируемом размонтировании
      }
    }
  }, [leaveOnline])

  // Обработчики событий браузера
  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log('🚨 beforeunload event triggered:', {
        hasJoinedRef: hasJoinedRef.current,
        timestamp: new Date().toISOString(),
      })
      if (hasJoinedRef.current) {
        leaveOnline(true) // Принудительно используем sendBeacon
      }
    }

    const handleVisibilityChange = () => {
      console.log('👁️ visibilitychange event triggered:', {
        visibilityState: document.visibilityState,
        hasJoinedRef: hasJoinedRef.current,
        timestamp: new Date().toISOString(),
      })
      if (document.visibilityState === 'hidden' && hasJoinedRef.current) {
        console.log('👁️ Page hidden, leaving room online')
        leaveOnline(true) // Принудительно используем sendBeacon
      }
    }

    const handlePageHide = () => {
      console.log('🚨 pagehide event triggered:', {
        hasJoinedRef: hasJoinedRef.current,
        timestamp: new Date().toISOString(),
      })
      if (hasJoinedRef.current) {
        leaveOnline(true) // Принудительно используем sendBeacon
      }
    }

    // Добавляем обработчики
    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('pagehide', handlePageHide)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      // Убираем обработчики
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('pagehide', handlePageHide)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [leaveOnline])

  return {
    joinOnline,
    leaveOnline,
    isOnline,
  }
}
