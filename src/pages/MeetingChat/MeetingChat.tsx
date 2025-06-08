import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import {
  Box,
  Container,
  Typography,
  Chip,
  Divider,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  LinearProgress,
  Paper,
  Button,
  CircularProgress,
  Tooltip,
} from '@mui/material'
import {
  Clock,
  Users,
  Tag,
  Globe,
  Timer,
  Lock,
  AlertCircle,
  CheckCircle,
} from 'lucide-react'
import {
  format,
  parseISO,
  differenceInMinutes,
  differenceInSeconds,
} from 'date-fns'
import { Meeting } from '../../components/MeetingCard/types'
import { RootState } from '../../store/store'
import { mapApiRoomToMeeting } from '../Meetings/Meetings'
import Loader from '../../components/Loader/Loader'
import VideoChat from '../../components/VideoChat/VideoChat'
import {
  containerStyle,
  headerStyle,
  chatContainerStyle,
  videoAreaStyle,
} from './styles'

function MeetingChat() {
  const { meetingId } = useParams()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [meeting, setMeeting] = useState<Meeting | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeParticipants] = useState(0) // TODO: Подключить к реальным данным Daily.co
  const [hasJoinedWaiting, setHasJoinedWaiting] = useState(false)
  const [hasJoinedRoom, setHasJoinedRoom] = useState(false)
  const [isJoiningRoom, setIsJoiningRoom] = useState(false)
  const [joinRequestStatus, setJoinRequestStatus] = useState<
    'none' | 'pending' | 'accepted' | 'rejected'
  >('none')

  // Получаем список комнат из Redux store
  const { rooms, isLoading } = useSelector((state: RootState) => state.rooms)
  // Получаем данные пользователя для регистрации присутствия
  const { isAuthenticated, id: userId } = useSelector(
    (state: RootState) => state.user
  )

  // Проверяем, является ли пользователь организатором комнаты
  const isOrganizer = meeting?.organizer?.id === userId

  // Функция для отправки приглашения на присоединение к комнате
  const sendJoinInvitation = useCallback(
    async (roomId: number, userId: number) => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/room/participant/invite/sendInvitation?userId=${userId}&roomId=${roomId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )

        if (response.ok) {
          const result = await response.json()
          return {
            success: true,
            participantId: result.participantId || userId,
          }
        } else {
          console.error('Failed to send join invitation:', response.statusText)
          return { success: false, error: response.statusText }
        }
      } catch (error) {
        console.error('Error sending join invitation:', error)
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        }
      }
    },
    []
  )

  // Функция для автоматического принятия приглашения (для публичных комнат)
  const acceptInvitation = useCallback(async (participantId: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/room/adminRoom/accept?participantId=${participantId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (response.ok) {
        return { success: true }
      } else {
        console.error('Failed to accept invitation:', response.statusText)
        return { success: false, error: response.statusText }
      }
    } catch (error) {
      console.error('Error accepting invitation:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }, [])

  // Функция присоединения к комнате
  const joinRoom = useCallback(async () => {
    if (!meeting || !userId || !isAuthenticated || isJoiningRoom) return

    setIsJoiningRoom(true)
    setJoinRequestStatus('pending')

    try {
      // 1. Отправляем приглашение
      const invitationResult = await sendJoinInvitation(meeting.id, userId)

      if (!invitationResult.success) {
        setJoinRequestStatus('rejected')
        return
      }

      // 2. Если комната публичная - автоматически принимаем приглашение
      if (!meeting.privateRoom) {
        const acceptResult = await acceptInvitation(
          invitationResult.participantId
        )

        if (acceptResult.success) {
          setJoinRequestStatus('accepted')
          setHasJoinedRoom(true)
          // Обновляем данные комнаты
          const updateRoomData = async () => {
            try {
              const response = await fetch(
                `http://localhost:8080/api/room/${meeting.id}`
              )
              if (response.ok) {
                const updatedRoom = await response.json()
                const updatedMeeting = mapApiRoomToMeeting(updatedRoom)
                setMeeting(updatedMeeting)
              }
            } catch (error) {
              console.error('Error updating room data:', error)
            }
          }
          await updateRoomData()
        } else {
          setJoinRequestStatus('rejected')
        }
      } else {
        // Для приватной комнаты ждем одобрения организатора
        setJoinRequestStatus('pending')
      }
    } catch (error) {
      console.error('Error joining room:', error)
      setJoinRequestStatus('rejected')
    } finally {
      setIsJoiningRoom(false)
    }
  }, [
    meeting,
    userId,
    isAuthenticated,
    isJoiningRoom,
    sendJoinInvitation,
    acceptInvitation,
  ])

  // Проверяем статус присоединения при загрузке
  useEffect(() => {
    if (meeting && isOrganizer) {
      setHasJoinedRoom(true)
      setJoinRequestStatus('accepted')
    }
  }, [meeting, isOrganizer])

  // Функция для уведомления сервера о присутствии пользователя в ожидании
  const notifyPresence = useCallback(
    async (roomId: number, isJoining: boolean = true) => {
      if (!userId || !isAuthenticated) return

      try {
        const endpoint = isJoining ? 'join' : 'leave'
        const response = await fetch(
          `http://localhost:8080/api/room/${roomId}/${endpoint}?userId=${userId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )

        if (response.ok) {
          setHasJoinedWaiting(isJoining)
        } else {
          console.error(`Failed to ${endpoint} room:`, response.statusText)
        }
      } catch (error) {
        console.error(`Error ${isJoining ? 'joining' : 'leaving'} room:`, error)
      }
    },
    [userId, isAuthenticated]
  )

  // Таймер для обновления текущего времени
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!meetingId || !rooms.length) {
      return
    }

    // Ищем комнату по id или slug
    const room = rooms.find(
      (room) =>
        room.id.toString() === meetingId ||
        room.topic
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '') === meetingId
    )

    if (room) {
      const mappedMeeting = mapApiRoomToMeeting(room)
      setMeeting(mappedMeeting)

      // Уведомляем сервер о присутствии пользователя
      notifyPresence(room.id, true)
    } else {
      // Если комната не найдена, редиректим на страницу со списком встреч
      navigate('/meetings')
    }
  }, [meetingId, rooms, navigate, notifyPresence])

  // Уведомляем сервер при уходе с страницы
  useEffect(() => {
    return () => {
      if (meeting) {
        notifyPresence(meeting.id, false)
      }
    }
  }, [meeting, notifyPresence])

  // Периодическое обновление данных комнаты для актуального количества участников
  useEffect(() => {
    if (!meeting) return

    const updateRoomData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/room/${meeting.id}`
        )
        if (response.ok) {
          const updatedRoom = await response.json()
          const updatedMeeting = mapApiRoomToMeeting(updatedRoom)
          setMeeting(updatedMeeting)
        }
      } catch (error) {
        console.error('Error updating room data:', error)
      }
    }

    // Обновляем данные каждые 10 секунд
    const interval = setInterval(updateRoomData, 10000)

    return () => clearInterval(interval)
  }, [meeting])

  // Функция проверки условий доступа к видеочату
  const checkChatAccess = () => {
    if (!meeting)
      return {
        hasAccess: false,
        reasons: [],
        minutesUntilStart: 0,
        conditions: {},
      }

    const startTime = parseISO(meeting.startTime)
    const minutesUntilStart = differenceInMinutes(startTime, currentTime)
    const waitingParticipants = meeting.waitingParticipants || 0
    const minParticipants = meeting.minParticipants || 4

    const conditions = {
      timeCondition: minutesUntilStart <= 5, // За 5 минут до начала
      waitingCondition: waitingParticipants >= minParticipants, // Достаточно ожидающих
      activeCondition: activeParticipants >= minParticipants, // Достаточно активных
    }

    const reasons = []
    if (!conditions.timeCondition) {
      reasons.push({
        type: 'time',
        message: t(
          'meetingChat.waitingConditions.timeCondition',
          'Meeting opens 5 minutes before start'
        ),
        met: false,
      })
    }
    if (!conditions.waitingCondition) {
      reasons.push({
        type: 'waiting',
        message: t(
          'meetingChat.waitingConditions.waitingCondition',
          'Need {{min}} waiting participants, have {{current}}',
          {
            min: minParticipants,
            current: waitingParticipants,
          }
        ),
        met: false,
      })
    }
    if (!conditions.activeCondition) {
      reasons.push({
        type: 'active',
        message: t(
          'meetingChat.waitingConditions.activeCondition',
          'Need {{min}} active participants, have {{current}}',
          {
            min: minParticipants,
            current: activeParticipants,
          }
        ),
        met: false,
      })
    }

    return {
      hasAccess:
        conditions.timeCondition &&
        conditions.waitingCondition &&
        conditions.activeCondition,
      reasons,
      minutesUntilStart,
      conditions,
    }
  }

  const chatAccess = checkChatAccess()

  if (isLoading) {
    return <Loader />
  }

  if (!meeting) {
    return (
      <Container>
        <Typography variant="h6" color="text.primary">
          {t('meetings.error.title')}
        </Typography>
      </Container>
    )
  }

  const formattedStartTime = format(
    parseISO(meeting.startTime),
    'dd.MM.yyyy HH:mm'
  )
  const formattedEndTime = format(parseISO(meeting.endTime), 'dd.MM.yyyy HH:mm')

  // Компонент ожидания доступа к видеочату
  const renderWaitingOverlay = () => {
    if (chatAccess.hasAccess) return null

    const startTime = parseISO(meeting.startTime)
    const secondsUntilStart = differenceInSeconds(startTime, currentTime)

    const formatTime = (seconds: number) => {
      if (seconds < 0) return '00:00:00'
      const hours = Math.floor(seconds / 3600)
      const mins = Math.floor((seconds % 3600) / 60)
      const secs = seconds % 60
      return `${hours.toString().padStart(2, '0')}:${mins
        .toString()
        .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    return (
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          borderRadius: 3,
        }}
      >
        <Paper
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 3,
            textAlign: 'center',
            maxWidth: 500,
            width: '90%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          }}
        >
          <Lock size={48} style={{ marginBottom: 16, opacity: 0.8 }} />

          <Typography variant="h5" fontWeight="600" gutterBottom>
            {t('meetingChat.waitingTitle', 'Meeting Room Locked')}
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
            {t(
              'meetingChat.waitingDescription',
              'The video chat will be available when all conditions are met'
            )}
          </Typography>

          {/* Таймер обратного отсчета */}
          <Box
            sx={{
              mb: 3,
              p: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 2,
            }}
          >
            <Typography variant="body2" sx={{ mb: 1, opacity: 0.8 }}>
              {t('meetingChat.timeUntilStart', 'Time until meeting starts:')}
            </Typography>
            <Typography variant="h4" fontWeight="600" fontFamily="monospace">
              {formatTime(secondsUntilStart)}
            </Typography>
          </Box>

          {/* Условия доступа */}
          <Box sx={{ textAlign: 'left' }}>
            <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
              {t('meetingChat.conditionsTitle', 'Required Conditions:')}
            </Typography>

            {chatAccess.reasons.map((reason, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 1,
                  p: 1.5,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 1,
                }}
              >
                {reason.met ? (
                  <CheckCircle
                    size={20}
                    style={{ marginRight: 8, color: '#4caf50' }}
                  />
                ) : (
                  <AlertCircle
                    size={20}
                    style={{ marginRight: 8, color: '#ff9800' }}
                  />
                )}
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {reason.message}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Прогресс-бар для времени */}
          {(chatAccess.minutesUntilStart || 0) > 5 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" sx={{ mb: 1, opacity: 0.8 }}>
                {t(
                  'meetingChat.timeProgress',
                  'Opens in 5 minutes before start'
                )}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.max(
                  0,
                  100 - ((chatAccess.minutesUntilStart || 0) / 60) * 100
                )}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#4caf50',
                    borderRadius: 4,
                  },
                }}
              />
            </Box>
          )}
        </Paper>
      </Box>
    )
  }

  return (
    <Container>
      <Box sx={containerStyle}>
        {/* Header */}
        <Box sx={headerStyle}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <Typography variant="h4" component="h1" color="text.primary">
              {meeting.name}
            </Typography>
            <Tooltip
              title={
                meeting.privateRoom
                  ? t(
                      'meetingCard.privateRoomDescription',
                      'Requires organizer approval to join'
                    )
                  : t(
                      'meetingCard.publicRoomDescription',
                      'Anyone can join immediately'
                    )
              }
              arrow
              placement="top"
            >
              <Chip
                icon={
                  meeting.privateRoom ? <Lock size={16} /> : <Users size={16} />
                }
                label={
                  meeting.privateRoom
                    ? t('meetingCard.privateRoom', 'Private Room')
                    : t('meetingCard.publicRoom', 'Public Room')
                }
                size="medium"
                sx={{
                  backgroundColor: meeting.privateRoom
                    ? 'rgba(255, 107, 107, 0.1)'
                    : 'rgba(81, 207, 102, 0.1)',
                  color: meeting.privateRoom ? '#ff6b6b' : '#51cf66',
                  border: `1px solid ${
                    meeting.privateRoom
                      ? 'rgba(255, 107, 107, 0.3)'
                      : 'rgba(81, 207, 102, 0.3)'
                  }`,
                  fontWeight: '500',
                  cursor: 'help',
                  '& .MuiChip-icon': {
                    color: meeting.privateRoom ? '#ff6b6b' : '#51cf66',
                  },
                  '&:hover': {
                    backgroundColor: meeting.privateRoom
                      ? 'rgba(255, 107, 107, 0.15)'
                      : 'rgba(81, 207, 102, 0.15)',
                  },
                }}
              />
            </Tooltip>
          </Box>
          {meeting.description && (
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              {meeting.description}
            </Typography>
          )}
        </Box>

        {/* Meeting Info Cards */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: isMobile
              ? '1fr'
              : 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 3,
            mb: 4,
          }}
        >
          {/* Time Card */}
          <Card
            elevation={2}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              '&:hover': {
                transform: 'translateY(-2px)',
                transition: 'transform 0.2s ease-in-out',
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Clock size={24} style={{ marginRight: 8 }} />
                <Typography variant="h6" component="h3" fontWeight="600">
                  {t('meetingCard.timeLabel')}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{ opacity: 0.9, minWidth: '60px' }}
                  >
                    {t('meetingCard.startTimeLabel')}
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {formattedStartTime}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{ opacity: 0.9, minWidth: '60px' }}
                  >
                    {t('meetingCard.endTimeLabel')}
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {formattedEndTime}
                  </Typography>
                </Box>
                {meeting.duration && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mt: 1,
                      pt: 1,
                      borderTop: '1px solid rgba(255,255,255,0.2)',
                    }}
                  >
                    <Timer size={16} />
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {t('meetingCard.durationLabel')}
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {meeting.duration}
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Participants Card */}
          <Card
            elevation={2}
            sx={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              '&:hover': {
                transform: 'translateY(-2px)',
                transition: 'transform 0.2s ease-in-out',
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Users size={24} style={{ marginRight: 8 }} />
                <Typography variant="h6" component="h3" fontWeight="600">
                  {t('meetingCard.participantsLabel')}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {t('meetingCard.minParticipantsLabel')}
                  </Typography>
                  <Typography variant="h5" fontWeight="600">
                    {meeting.minParticipants}
                  </Typography>
                </Box>
                {meeting.maxParticipants && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {t('meetingCard.maxParticipantsLabel')}
                    </Typography>
                    <Typography variant="h5" fontWeight="600">
                      {meeting.maxParticipants}
                    </Typography>
                  </Box>
                )}
                {meeting.waitingParticipants !== undefined &&
                  meeting.waitingParticipants > 0 && (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 1,
                        pt: 1,
                        borderTop: '1px solid rgba(255,255,255,0.2)',
                      }}
                    >
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        {t('meetingCard.waitingParticipantsLabel')}
                      </Typography>
                      <Typography variant="h5" fontWeight="600">
                        {meeting.waitingParticipants}
                      </Typography>
                    </Box>
                  )}
                {/* Индикация присоединения текущего пользователя */}
                {hasJoinedWaiting && isAuthenticated && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mt: 1,
                      pt: 1,
                      borderTop: '1px solid rgba(255,255,255,0.2)',
                      backgroundColor: 'rgba(76, 175, 80, 0.2)',
                      borderRadius: 1,
                      px: 1,
                      py: 0.5,
                    }}
                  >
                    <CheckCircle size={16} style={{ color: '#4caf50' }} />
                    <Typography variant="body2" sx={{ fontWeight: '500' }}>
                      {t('meetingChat.joinedWaitingRoom')}
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Category & Language Card */}
          <Card
            elevation={2}
            sx={{
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              '&:hover': {
                transform: 'translateY(-2px)',
                transition: 'transform 0.2s ease-in-out',
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Tag size={24} style={{ marginRight: 8 }} />
                <Typography variant="h6" component="h3" fontWeight="600">
                  {t('meetingCard.categoryLabel')}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Chip
                  label={meeting.category}
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: '500',
                    border: '1px solid rgba(255,255,255,0.3)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.3)',
                    },
                  }}
                  size="medium"
                />
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    pt: 1,
                    borderTop: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  <Globe size={16} />
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    <Chip
                      label={meeting.language}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.3)',
                        fontSize: '0.75rem',
                      }}
                    />
                    {meeting.proficiency && (
                      <Chip
                        label={meeting.proficiency}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(255,255,255,0.15)',
                          color: 'white',
                          border: '1px solid rgba(255,255,255,0.3)',
                          fontSize: '0.75rem',
                        }}
                      />
                    )}
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Video Area or Join Button */}
        {hasJoinedRoom || isOrganizer ? (
          <Box sx={chatContainerStyle}>
            <Box sx={{ ...videoAreaStyle, position: 'relative' }}>
              <Box
                sx={{
                  filter: chatAccess.hasAccess ? 'none' : 'blur(10px)',
                  transition: 'filter 0.3s ease-in-out',
                  height: '100%',
                }}
              >
                <VideoChat roomUrl={meeting.roomUrl} />
              </Box>
              {renderWaitingOverlay()}
            </Box>
          </Box>
        ) : (
          <Box sx={chatContainerStyle}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '400px',
                gap: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 3,
                color: 'white',
                textAlign: 'center',
                p: 4,
              }}
            >
              {/* Join Status Display */}
              {joinRequestStatus === 'pending' && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <CircularProgress color="inherit" size={48} />
                  <Typography variant="h5" fontWeight="600">
                    {meeting.privateRoom
                      ? t(
                          'meetingChat.waitingApproval',
                          'Waiting for approval...'
                        )
                      : t('meetingChat.joiningRoom', 'Joining room...')}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    {meeting.privateRoom
                      ? t(
                          'meetingChat.waitingApprovalDescription',
                          'The organizer will approve your request shortly'
                        )
                      : t(
                          'meetingChat.joiningRoomDescription',
                          'Please wait while we connect you to the room'
                        )}
                  </Typography>
                </Box>
              )}

              {joinRequestStatus === 'rejected' && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <AlertCircle size={48} style={{ color: '#ff6b6b' }} />
                  <Typography variant="h5" fontWeight="600">
                    {t('meetingChat.joinFailed', 'Join Request Failed')}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    {t(
                      'meetingChat.joinFailedDescription',
                      'Unable to join the room. Please try again.'
                    )}
                  </Typography>
                </Box>
              )}

              {(joinRequestStatus === 'none' ||
                joinRequestStatus === 'rejected') && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Users size={64} style={{ opacity: 0.8 }} />
                  <Typography variant="h4" fontWeight="600">
                    {t('meetingChat.joinRoom', 'Join Video Chat')}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ opacity: 0.9, maxWidth: 400 }}
                  >
                    {meeting.privateRoom
                      ? t(
                          'meetingChat.privateRoomJoinDescription',
                          'This is a private room. Your request will be sent to the organizer for approval.'
                        )
                      : t(
                          'meetingChat.publicRoomJoinDescription',
                          'This is a public room. You can join the video chat immediately.'
                        )}
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={joinRoom}
                    disabled={isJoiningRoom}
                    startIcon={
                      isJoiningRoom ? (
                        <CircularProgress size={20} />
                      ) : (
                        <Users size={20} />
                      )
                    }
                    sx={{
                      mt: 2,
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      border: '2px solid rgba(255,255,255,0.3)',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.3)',
                        border: '2px solid rgba(255,255,255,0.5)',
                      },
                      '&:disabled': {
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.6)',
                      },
                    }}
                  >
                    {isJoiningRoom
                      ? t('meetingChat.joiningButton', 'Joining...')
                      : t('meetingChat.joinButton', 'Join Room')}
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  )
}

export default MeetingChat
