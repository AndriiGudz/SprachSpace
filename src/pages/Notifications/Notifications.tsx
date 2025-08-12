import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import {
  Container,
  Typography,
  Box,
  Stack,
  Chip,
  Button,
  Card,
  CardContent,
  Badge,
} from '@mui/material'
import { ReactComponent as NotificationsIcon } from '../../assets/icon/IoNotifications.svg'
import { ReactComponent as CalendarIcon } from '../../assets/icon/BiCalendar.svg'
import { ReactComponent as FriendsIcon } from '../../assets/icon/GiThreeFriends.svg'
import { ReactComponent as AdminIcon } from '../../assets/icon/AdminIcon.svg'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store/store'
import { containerStyle, boxTitleStyle, notificationCardStyle } from './styles'
import { NotificationFilter } from '../../store/redux/notificationSlice/types'
import {
  fetchNotifications,
  setFilter,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../../store/redux/notificationSlice/notificationSlice'
import {
  selectFilteredNotifications,
  selectNotificationCounts,
  selectNotificationsLoading,
  selectCurrentFilter,
  selectUnreadCount,
} from '../../store/redux/notificationSlice/selectors'
import { Notification } from '../../store/redux/notificationSlice/types'
import Loader from '../../components/Loader/Loader'

function Notifications() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Селекторы Redux
  const user = useSelector((state: RootState) => state.user)
  const filteredNotifications = useSelector(selectFilteredNotifications)
  const filterCounts = useSelector(selectNotificationCounts)
  const isLoading = useSelector(selectNotificationsLoading)
  const activeFilter = useSelector(selectCurrentFilter)
  const unreadCount = useSelector(selectUnreadCount)

  // Загружаем уведомления при монтировании компонента
  useEffect(() => {
    if (user.isAuthenticated) {
      dispatch(fetchNotifications() as any)
    }
  }, [dispatch, user.isAuthenticated])

  // Получение иконки для типа уведомления
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'meeting_invitation':
      case 'meeting_cancelled':
      case 'meeting_reminder':
        return (
          <CalendarIcon style={{ width: 24, height: 24, color: '#1976d2' }} />
        )
      case 'friend_request':
        return (
          <FriendsIcon style={{ width: 24, height: 24, color: '#f57c00' }} />
        )
      case 'system':
        return <AdminIcon style={{ width: 24, height: 24, color: '#9c27b0' }} />
      default:
        return (
          <NotificationsIcon style={{ width: 24, height: 24, color: '#666' }} />
        )
    }
  }

  // Форматирование времени
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60))
      return `${diffMinutes} мин. назад`
    } else if (diffHours < 24) {
      return `${diffHours} ч. назад`
    } else if (diffDays === 1) {
      return 'вчера'
    } else {
      return `${diffDays} дн. назад`
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    // Отмечаем уведомление как прочитанное при клике
    if (!notification.isRead) {
      dispatch(markNotificationAsRead(notification.id) as any)
    }

    if (notification.actionUrl) {
      navigate(notification.actionUrl)
    }
  }

  const handleFilterChange = (filter: NotificationFilter) => {
    dispatch(setFilter(filter))
  }

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead() as any)
  }

  if (!user.isAuthenticated) {
    return (
      <Container sx={{ ...containerStyle, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          {t('scheduledMeetings.notAuthenticated')}
        </Typography>
        <Button variant="contained" onClick={() => navigate('/signin')}>
          {t('userMenu.signIn')}
        </Button>
      </Container>
    )
  }

  if (isLoading) {
    return (
      <Container
        sx={{
          ...containerStyle,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
        }}
      >
        <Loader />
      </Container>
    )
  }

  return (
    <Container maxWidth={false} disableGutters sx={containerStyle}>
      <Box sx={boxTitleStyle}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon
              style={{ width: 32, height: 32, color: '#1976d2' }}
            />
          </Badge>
          <Typography variant="h2" gutterBottom>
            {t('userMenu.notifications')}
          </Typography>
        </Box>
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
          {t('notifications.description')}
        </Typography>
      </Box>

      {/* Фильтры и кнопка отметить все */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          maxWidth: '1200px',
          mx: 'auto',
          gap: 1,
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          px: 2,
        }}
      >
        {/* Группа фильтров */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Chip
            label={`${t('notifications.filters.all')} (${filterCounts.all})`}
            onClick={() => handleFilterChange('all')}
            variant={activeFilter === 'all' ? 'filled' : 'outlined'}
            color={activeFilter === 'all' ? 'primary' : 'default'}
            sx={{
              fontSize: '0.875rem',
              height: 40,
              backdropFilter: 'blur(10px)',
              background:
                activeFilter === 'all'
                  ? 'rgba(25, 118, 210, 0.8)'
                  : 'rgba(255, 255, 255, 0.3)',
              border:
                activeFilter === 'all'
                  ? '1px solid rgba(25, 118, 210, 0.4)'
                  : '1px solid rgba(255, 255, 255, 0.4)',
              color: activeFilter === 'all' ? '#fff' : 'inherit',
              transition: 'all 0.3s ease',
              transform:
                activeFilter === 'all' ? 'translateY(-1px)' : 'translateY(0px)',
              boxShadow:
                activeFilter === 'all'
                  ? '0 6px 20px rgba(25, 118, 210, 0.25)'
                  : '0 3px 12px rgba(0, 0, 0, 0.15)',
              '&:hover': {
                background:
                  activeFilter === 'all'
                    ? 'rgba(25, 118, 210, 0.9)'
                    : 'rgba(255, 255, 255, 0.4)',
                transform: 'translateY(-3px)',
                boxShadow:
                  activeFilter === 'all'
                    ? '0 8px 25px rgba(25, 118, 210, 0.4)'
                    : '0 6px 20px rgba(0, 0, 0, 0.2)',
              },
            }}
          />
          <Chip
            label={`${t('notifications.filters.unread')} (${
              filterCounts.unread
            })`}
            onClick={() => handleFilterChange('unread')}
            variant={activeFilter === 'unread' ? 'filled' : 'outlined'}
            color={activeFilter === 'unread' ? 'error' : 'default'}
            sx={{
              fontSize: '0.875rem',
              height: 40,
              backdropFilter: 'blur(10px)',
              background:
                activeFilter === 'unread'
                  ? 'rgba(211, 47, 47, 0.8)'
                  : 'rgba(255, 255, 255, 0.3)',
              border:
                activeFilter === 'unread'
                  ? '1px solid rgba(211, 47, 47, 0.4)'
                  : '1px solid rgba(255, 255, 255, 0.4)',
              color: activeFilter === 'unread' ? '#fff' : 'inherit',
              transition: 'all 0.3s ease',
              transform:
                activeFilter === 'unread'
                  ? 'translateY(-1px)'
                  : 'translateY(0px)',
              boxShadow:
                activeFilter === 'unread'
                  ? '0 6px 20px rgba(211, 47, 47, 0.25)'
                  : '0 3px 12px rgba(0, 0, 0, 0.15)',
              '&:hover': {
                background:
                  activeFilter === 'unread'
                    ? 'rgba(211, 47, 47, 0.9)'
                    : 'rgba(255, 255, 255, 0.4)',
                transform: 'translateY(-3px)',
                boxShadow:
                  activeFilter === 'unread'
                    ? '0 8px 25px rgba(211, 47, 47, 0.4)'
                    : '0 6px 20px rgba(0, 0, 0, 0.2)',
              },
            }}
          />
          <Chip
            label={`${t('notifications.filters.read')} (${filterCounts.read})`}
            onClick={() => handleFilterChange('read')}
            variant={activeFilter === 'read' ? 'filled' : 'outlined'}
            color={activeFilter === 'read' ? 'success' : 'default'}
            sx={{
              fontSize: '0.875rem',
              height: 40,
              backdropFilter: 'blur(10px)',
              background:
                activeFilter === 'read'
                  ? 'rgba(46, 125, 50, 0.8)'
                  : 'rgba(255, 255, 255, 0.3)',
              border:
                activeFilter === 'read'
                  ? '1px solid rgba(46, 125, 50, 0.4)'
                  : '1px solid rgba(255, 255, 255, 0.4)',
              color: activeFilter === 'read' ? '#fff' : 'inherit',
              transition: 'all 0.3s ease',
              transform:
                activeFilter === 'read'
                  ? 'translateY(-1px)'
                  : 'translateY(0px)',
              boxShadow:
                activeFilter === 'read'
                  ? '0 6px 20px rgba(46, 125, 50, 0.25)'
                  : '0 3px 12px rgba(0, 0, 0, 0.15)',
              '&:hover': {
                background:
                  activeFilter === 'read'
                    ? 'rgba(46, 125, 50, 0.9)'
                    : 'rgba(255, 255, 255, 0.4)',
                transform: 'translateY(-3px)',
                boxShadow:
                  activeFilter === 'read'
                    ? '0 8px 25px rgba(46, 125, 50, 0.4)'
                    : '0 6px 20px rgba(0, 0, 0, 0.2)',
              },
            }}
          />
          <Chip
            label={`${t('notifications.filters.meetings')} (${
              filterCounts.meetings
            })`}
            onClick={() => handleFilterChange('meetings')}
            variant={activeFilter === 'meetings' ? 'filled' : 'outlined'}
            color={activeFilter === 'meetings' ? 'info' : 'default'}
            sx={{
              fontSize: '0.875rem',
              height: 40,
              backdropFilter: 'blur(10px)',
              background:
                activeFilter === 'meetings'
                  ? 'rgba(2, 136, 209, 0.8)'
                  : 'rgba(255, 255, 255, 0.3)',
              border:
                activeFilter === 'meetings'
                  ? '1px solid rgba(2, 136, 209, 0.4)'
                  : '1px solid rgba(255, 255, 255, 0.4)',
              color: activeFilter === 'meetings' ? '#fff' : 'inherit',
              transition: 'all 0.3s ease',
              transform:
                activeFilter === 'meetings'
                  ? 'translateY(-1px)'
                  : 'translateY(0px)',
              boxShadow:
                activeFilter === 'meetings'
                  ? '0 6px 20px rgba(2, 136, 209, 0.25)'
                  : '0 3px 12px rgba(0, 0, 0, 0.15)',
              '&:hover': {
                background:
                  activeFilter === 'meetings'
                    ? 'rgba(2, 136, 209, 0.9)'
                    : 'rgba(255, 255, 255, 0.4)',
                transform: 'translateY(-3px)',
                boxShadow:
                  activeFilter === 'meetings'
                    ? '0 8px 25px rgba(2, 136, 209, 0.4)'
                    : '0 6px 20px rgba(0, 0, 0, 0.2)',
              },
            }}
          />
          <Chip
            label={`${t('notifications.filters.system')} (${
              filterCounts.system
            })`}
            onClick={() => handleFilterChange('system')}
            variant={activeFilter === 'system' ? 'filled' : 'outlined'}
            color={activeFilter === 'system' ? 'warning' : 'default'}
            sx={{
              fontSize: '0.875rem',
              height: 40,
              backdropFilter: 'blur(10px)',
              background:
                activeFilter === 'system'
                  ? 'rgba(237, 108, 2, 0.8)'
                  : 'rgba(255, 255, 255, 0.3)',
              border:
                activeFilter === 'system'
                  ? '1px solid rgba(237, 108, 2, 0.4)'
                  : '1px solid rgba(255, 255, 255, 0.4)',
              color: activeFilter === 'system' ? '#fff' : 'inherit',
              transition: 'all 0.3s ease',
              transform:
                activeFilter === 'system'
                  ? 'translateY(-1px)'
                  : 'translateY(0px)',
              boxShadow:
                activeFilter === 'system'
                  ? '0 6px 20px rgba(237, 108, 2, 0.25)'
                  : '0 3px 12px rgba(0, 0, 0, 0.15)',
              '&:hover': {
                background:
                  activeFilter === 'system'
                    ? 'rgba(237, 108, 2, 0.9)'
                    : 'rgba(255, 255, 255, 0.4)',
                transform: 'translateY(-3px)',
                boxShadow:
                  activeFilter === 'system'
                    ? '0 8px 25px rgba(237, 108, 2, 0.4)'
                    : '0 6px 20px rgba(0, 0, 0, 0.2)',
              },
            }}
          />
        </Box>

        {/* Кнопка отметить все как прочитанные */}
        {unreadCount > 0 && (
          <Button
            variant="outlined"
            size="small"
            onClick={handleMarkAllAsRead}
            sx={{
              height: 40,
              minWidth: 'auto',
              px: 2,
              whiteSpace: 'nowrap',
            }}
          >
            {t('notifications.markAllAsRead')}
          </Button>
        )}
      </Box>

      {/* Список уведомлений */}
      <Box sx={notificationCardStyle}>
        {filteredNotifications.length > 0 ? (
          <Stack spacing={2} mt={3}>
            {filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                sx={{
                  cursor: notification.actionUrl ? 'pointer' : 'default',
                  backgroundColor: notification.isRead
                    ? 'background.paper'
                    : 'action.hover',
                  '&:hover': notification.actionUrl
                    ? {
                        backgroundColor: 'action.selected',
                      }
                    : {},
                  transition: 'background-color 0.2s',
                }}
                onClick={() => handleNotificationClick(notification)}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}
                  >
                    <Box sx={{ mt: 0.5 }}>
                      {getNotificationIcon(notification.type)}
                    </Box>
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: notification.isRead ? 400 : 600,
                            fontSize: '1.1rem',
                          }}
                        >
                          {notification.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'text.secondary',
                            whiteSpace: 'nowrap',
                            ml: 2,
                          }}
                        >
                          {formatTime(notification.createdAt)}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          fontWeight: notification.isRead ? 400 : 500,
                        }}
                      >
                        {notification.message}
                      </Typography>
                      {!notification.isRead && (
                        <Box sx={{ mt: 1 }}>
                          <Chip
                            size="small"
                            label={t('notifications.new')}
                            color="error"
                            variant="filled"
                            sx={{ fontSize: '0.75rem', height: 20 }}
                          />
                        </Box>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        ) : (
          <Box textAlign="center" mt={4}>
            <NotificationsIcon
              style={{ width: 64, height: 64, color: '#ccc', marginBottom: 16 }}
            />
            <Typography variant="h6" gutterBottom>
              {t('notifications.noNotifications')}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {t('notifications.noNotificationsDescription')}
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  )
}

export default Notifications
