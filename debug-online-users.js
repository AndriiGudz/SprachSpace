// Скрипт для отладки онлайн пользователей
// Вставьте этот код в консоль браузера для проверки

console.log('=== DEBUG ONLINE USERS ===')

// 1. Проверяем localStorage для всех ключей room_online
console.log('1. LocalStorage keys for room_online:')
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i)
  if (key && key.startsWith('room_online_')) {
    const value = localStorage.getItem(key)
    console.log(`  ${key}:`, JSON.parse(value))
  }
}

// 2. Функция для проверки конкретной комнаты
async function checkRoomOnlineUsers(roomId) {
  console.log(`\n2. Checking room ${roomId} online users:`)

  try {
    const response = await fetch(
      `http://localhost:8080/api/room/id?roomId=${roomId}`
    )
    const data = await response.json()
    console.log(`  Room ${roomId} data:`, {
      countOnlineUser: data.countOnlineUser,
      roomOnlineUsers: data.roomOnlineUsers?.length || 0,
      users:
        data.roomOnlineUsers?.map((u) => ({
          id: u.id,
          nickname: u.nickname || u.name,
          avatar: u.avatar,
        })) || [],
    })
  } catch (err) {
    console.error('Error fetching room data:', err)
  }
}

// 3. Функция для принудительного присоединения пользователя
async function forceJoinUser(userId, roomId) {
  console.log(`\n3. Force joining user ${userId} to room ${roomId}:`)

  const url = `http://localhost:8080/api/room/online?userId=${userId}&roomId=${roomId}`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await response.text()
    console.log(`  POST response:`, {
      status: response.status,
      body: data,
    })

    // Проверяем результат
    await new Promise((resolve) => setTimeout(resolve, 1000))
    await checkRoomOnlineUsers(roomId)
  } catch (err) {
    console.error('Error joining user:', err)
  }
}

// 4. Функция для принудительного выхода пользователя
async function forceLeaveUser(userId, roomId) {
  console.log(`\n4. Force leaving user ${userId} from room ${roomId}:`)

  const url = `http://localhost:8080/api/room/online?userId=${userId}&roomId=${roomId}`

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, roomId }),
    })
    const data = await response.text()
    console.log(`  DELETE response:`, {
      status: response.status,
      body: data,
    })

    // Проверяем результат
    await new Promise((resolve) => setTimeout(resolve, 1000))
    await checkRoomOnlineUsers(roomId)
  } catch (err) {
    console.error('Error leaving user:', err)
  }
}

// 5. Очистка localStorage для отладки
function clearRoomOnlineStorage() {
  console.log('\n5. Clearing room_online localStorage:')
  const keysToRemove = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith('room_online_')) {
      keysToRemove.push(key)
    }
  }

  keysToRemove.forEach((key) => {
    localStorage.removeItem(key)
    console.log(`  Removed: ${key}`)
  })
}

// Примеры использования:
console.log('\n=== USAGE EXAMPLES ===')
console.log('checkRoomOnlineUsers(13); // Проверить комнату 13')
console.log('forceJoinUser(9, 13); // Присоединить пользователя 9 к комнате 13')
console.log(
  'forceJoinUser(10, 13); // Присоединить пользователя 10 к комнате 13'
)
console.log('forceLeaveUser(9, 13); // Отключить пользователя 9 от комнаты 13')
console.log('clearRoomOnlineStorage(); // Очистить localStorage')

// Автоматически проверяем текущую комнату
const currentRoomId = window.location.pathname.match(/\/meetings\/(\d+)/)?.[1]
if (currentRoomId) {
  console.log(`\n=== AUTO CHECK FOR ROOM ${currentRoomId} ===`)
  checkRoomOnlineUsers(parseInt(currentRoomId))
}

// Экспортируем функции в глобальную область для использования в консоли
window.checkRoomOnlineUsers = checkRoomOnlineUsers
window.forceJoinUser = forceJoinUser
window.forceLeaveUser = forceLeaveUser
window.clearRoomOnlineStorage = clearRoomOnlineStorage
