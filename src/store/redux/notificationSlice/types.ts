export interface Notification {
  id: string
  type:
    | 'meeting_invitation'
    | 'meeting_cancelled'
    | 'meeting_reminder'
    | 'system'
    | 'friend_request'
  title: string
  message: string
  isRead: boolean
  createdAt: string
  actionUrl?: string
  metadata?: {
    meetingId?: string
    userId?: string
    roomName?: string
  }
}

export type NotificationFilter =
  | 'all'
  | 'unread'
  | 'read'
  | 'meetings'
  | 'system'

export interface NotificationSliceState {
  notifications: Notification[]
  isLoading: boolean
  error: string | null
  filter: NotificationFilter
  lastUpdated: string | null
}
