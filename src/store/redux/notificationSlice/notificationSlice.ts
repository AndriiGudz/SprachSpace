import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import type {
  Notification,
  NotificationSliceState,
  NotificationFilter,
} from './types'

// Демо данные для начальной загрузки
const demoNotifications: Notification[] = [
  {
    id: '1',
    type: 'meeting_invitation',
    title: 'Приглашение на встречу',
    message:
      'Вас пригласили на встречу "Английский для начинающих" завтра в 18:00',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    actionUrl: '/meetings/1',
    metadata: {
      meetingId: '1',
      roomName: 'Английский для начинающих',
    },
  },
  {
    id: '2',
    type: 'meeting_reminder',
    title: 'Напоминание о встрече',
    message:
      'Через 30 минут начинается ваша встреча "Немецкий разговорный клуб"',
    isRead: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    actionUrl: '/meetings/2',
    metadata: {
      meetingId: '2',
      roomName: 'Немецкий разговорный клуб',
    },
  },
  {
    id: '3',
    type: 'meeting_cancelled',
    title: 'Встреча отменена',
    message:
      'К сожалению, встреча "Французский для продвинутых" была отменена организатором',
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    metadata: {
      roomName: 'Французский для продвинутых',
    },
  },
  {
    id: '4',
    type: 'friend_request',
    title: 'Новая заявка в друзья',
    message: 'Пользователь Anna Schmidt хочет добавить вас в друзья',
    isRead: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    actionUrl: '/profile/friends',
    metadata: {
      userId: 'user123',
    },
  },
  {
    id: '5',
    type: 'system',
    title: 'Обновление системы',
    message:
      'Добавлены новые функции: теперь вы можете оценивать встречи и оставлять отзывы!',
    isRead: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

// Async thunk для загрузки уведомлений с сервера
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Заменить на реальный API запрос
      // const response = await fetch('/api/notifications')
      // const data = await response.json()
      // return data

      // Пока возвращаем демо данные
      return new Promise<Notification[]>((resolve) => {
        setTimeout(() => {
          resolve(demoNotifications)
        }, 1000)
      })
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка загрузки уведомлений'
      )
    }
  }
)

// Async thunk для отметки уведомления как прочитанного
export const markNotificationAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId: string, { rejectWithValue }) => {
    try {
      // TODO: Заменить на реальный API запрос
      // const response = await fetch(`/api/notifications/${notificationId}/mark-read`, {
      //   method: 'PUT'
      // })
      // if (!response.ok) throw new Error('Failed to mark as read')

      // Симулируем API запрос
      return new Promise<string>((resolve) => {
        setTimeout(() => {
          resolve(notificationId)
        }, 300)
      })
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка обновления уведомления'
      )
    }
  }
)

// Async thunk для отметки всех уведомлений как прочитанных
export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Заменить на реальный API запрос
      // const response = await fetch('/api/notifications/mark-all-read', {
      //   method: 'PUT'
      // })
      // if (!response.ok) throw new Error('Failed to mark all as read')

      // Симулируем API запрос
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve()
        }, 500)
      })
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка обновления уведомлений'
      )
    }
  }
)

// Начальное состояние
export const initialState: NotificationSliceState = {
  notifications: [],
  isLoading: false,
  error: null,
  filter: 'all',
  lastUpdated: null,
}

export const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // Установить фильтр
    setFilter: (state, action: PayloadAction<NotificationFilter>) => {
      state.filter = action.payload
    },

    // Добавить новое уведомление
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload)
      state.lastUpdated = new Date().toISOString()
    },

    // Удалить уведомление
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      )
      state.lastUpdated = new Date().toISOString()
    },

    // Отметить уведомление как прочитанное (локально)
    markAsReadLocal: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(
        (n) => n.id === action.payload
      )
      if (notification) {
        notification.isRead = true
        state.lastUpdated = new Date().toISOString()
      }
    },

    // Отметить все уведомления как прочитанные (локально)
    markAllAsReadLocal: (state) => {
      state.notifications.forEach((notification) => {
        notification.isRead = true
      })
      state.lastUpdated = new Date().toISOString()
    },

    // Очистить ошибку
    clearError: (state) => {
      state.error = null
    },

    // Очистить все уведомления
    clearAllNotifications: (state) => {
      state.notifications = []
      state.lastUpdated = new Date().toISOString()
    },
  },
  extraReducers: (builder) => {
    builder
      // Загрузка уведомлений
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false
        state.notifications = action.payload
        state.lastUpdated = new Date().toISOString()
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Отметка как прочитанное
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(
          (n) => n.id === action.payload
        )
        if (notification) {
          notification.isRead = true
          state.lastUpdated = new Date().toISOString()
        }
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.error = action.payload as string
      })

      // Отметка всех как прочитанные
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications.forEach((notification) => {
          notification.isRead = true
        })
        state.lastUpdated = new Date().toISOString()
      })
      .addCase(markAllNotificationsAsRead.rejected, (state, action) => {
        state.error = action.payload as string
      })
  },
})

// Экспорт действий
export const {
  setFilter,
  addNotification,
  removeNotification,
  markAsReadLocal,
  markAllAsReadLocal,
  clearError,
  clearAllNotifications,
} = notificationSlice.actions

// Экспорт редьюсера
export default notificationSlice.reducer
