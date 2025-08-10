import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../../store'
import type { Notification } from './types'

// Базовые селекторы
export const selectNotificationsState = (state: RootState) =>
  state.notifications

export const selectAllNotifications = (state: RootState) =>
  state.notifications.notifications

export const selectNotificationsLoading = (state: RootState) =>
  state.notifications.isLoading

export const selectNotificationsError = (state: RootState) =>
  state.notifications.error

export const selectCurrentFilter = (state: RootState) =>
  state.notifications.filter

export const selectLastUpdated = (state: RootState) =>
  state.notifications.lastUpdated

// Селекторы с фильтрацией
export const selectUnreadNotifications = createSelector(
  [selectAllNotifications],
  (notifications) => notifications.filter((n) => !n.isRead)
)

export const selectReadNotifications = createSelector(
  [selectAllNotifications],
  (notifications) => notifications.filter((n) => n.isRead)
)

export const selectMeetingNotifications = createSelector(
  [selectAllNotifications],
  (notifications) =>
    notifications.filter((n) =>
      ['meeting_invitation', 'meeting_cancelled', 'meeting_reminder'].includes(
        n.type
      )
    )
)

export const selectSystemNotifications = createSelector(
  [selectAllNotifications],
  (notifications) =>
    notifications.filter((n) => ['system', 'friend_request'].includes(n.type))
)

// Селектор отфильтрованных уведомлений на основе текущего фильтра
export const selectFilteredNotifications = createSelector(
  [selectAllNotifications, selectCurrentFilter],
  (notifications, filter) => {
    switch (filter) {
      case 'unread':
        return notifications.filter((n) => !n.isRead)
      case 'read':
        return notifications.filter((n) => n.isRead)
      case 'meetings':
        return notifications.filter((n) =>
          [
            'meeting_invitation',
            'meeting_cancelled',
            'meeting_reminder',
          ].includes(n.type)
        )
      case 'system':
        return notifications.filter((n) =>
          ['system', 'friend_request'].includes(n.type)
        )
      default:
        return notifications
    }
  }
)

// Селекторы для подсчета
export const selectNotificationCounts = createSelector(
  [selectAllNotifications],
  (notifications) => {
    const unread = notifications.filter((n) => !n.isRead).length
    const read = notifications.filter((n) => n.isRead).length
    const meetings = notifications.filter((n) =>
      ['meeting_invitation', 'meeting_cancelled', 'meeting_reminder'].includes(
        n.type
      )
    ).length
    const system = notifications.filter((n) =>
      ['system', 'friend_request'].includes(n.type)
    ).length

    return {
      all: notifications.length,
      unread,
      read,
      meetings,
      system,
    }
  }
)

// Селектор количества непрочитанных уведомлений
export const selectUnreadCount = createSelector(
  [selectUnreadNotifications],
  (unreadNotifications) => unreadNotifications.length
)

// Селектор для получения уведомления по ID
export const selectNotificationById = createSelector(
  [
    selectAllNotifications,
    (_: RootState, notificationId: string) => notificationId,
  ],
  (notifications, notificationId) =>
    notifications.find((n) => n.id === notificationId)
)

// Селектор для получения последних уведомлений (лимит)
export const selectRecentNotifications = createSelector(
  [selectAllNotifications, (_: RootState, limit: number) => limit],
  (notifications, limit) => notifications.slice(0, limit)
)

// Селектор для группировки по типу
export const selectNotificationsByType = createSelector(
  [selectAllNotifications],
  (notifications) => {
    return notifications.reduce((groups, notification) => {
      const type = notification.type
      if (!groups[type]) {
        groups[type] = []
      }
      groups[type].push(notification)
      return groups
    }, {} as Record<Notification['type'], Notification[]>)
  }
)

// Селектор для получения уведомлений за определенный период
export const selectNotificationsByDateRange = createSelector(
  [
    selectAllNotifications,
    (_: RootState, startDate: Date) => startDate,
    (_: RootState, startDate: Date, endDate: Date) => endDate,
  ],
  (notifications, startDate, endDate) => {
    return notifications.filter((n) => {
      const notificationDate = new Date(n.createdAt)
      return notificationDate >= startDate && notificationDate <= endDate
    })
  }
)
