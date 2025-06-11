import { useEffect, useState, useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import type { AppDispatch } from '../../store/store'
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
  Crown,
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
import { sendJoinRequest } from '../../store/redux/roomSlice/roomSlice'
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
  const dispatch = useDispatch<AppDispatch>()
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
  const { rooms, isLoading, userParticipations } = useSelector(
    (state: RootState) => state.rooms
  )

  // Получаем данные пользователя для регистрации присутствия
  const { isAuthenticated, id: userId } = useSelector(
    (state: RootState) => state.user
  )

  // Проверяем, является ли пользователь организатором комнаты
  const isOrganizer = meeting?.organizer?.id === userId

  // Получаем информацию о заявке пользователя для текущей комнаты
  const userParticipation = useMemo(() => {
    if (!meeting || !userId) return null

    // Ищем в participants массиве полученном с сервера (приоритет)
    if (meeting.participants) {
      const participant = meeting.participants.find(
        (p) => p.user?.id === userId
      )
      if (participant) {
        console.log(
          'Found user participation in meeting.participants:',
          participant
        )
        return participant
      }
    }

    // Если не найдено в данных сервера, проверяем Redux store
    // Обеспечиваем что userParticipations всегда объект
    const safeUserParticipations = userParticipations || {}
    if (
      safeUserParticipations &&
      typeof safeUserParticipations === 'object' &&
      safeUserParticipations[meeting.id]
    ) {
      console.log(
        'Found user participation in Redux store:',
        safeUserParticipations[meeting.id]
      )
      return safeUserParticipations[meeting.id]
    }

    return null
  }, [meeting, userParticipations, userId])

  // Функция для обновления данных комнаты
  const updateRoomData = useCallback(async () => {
    if (!meeting) return

    try {
      const response = await fetch(
        `http://localhost:8080/api/room/id?roomId=${meeting.id}`
      )
      if (response.ok) {
        const updatedRoom = await response.json()
        const updatedMeeting = mapApiRoomToMeeting(updatedRoom)
        setMeeting(updatedMeeting)
        console.log('Room data updated:', updatedMeeting)
      } else {
        console.error('Failed to fetch room data:', response.statusText)
      }
    } catch (error) {
      console.error('Error updating room data:', error)
    }
  }, [meeting])

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
      } else if (response.status === 409) {
        // 409 Conflict означает что участник уже принят - это нормально
        console.log('Participant already accepted, proceeding')
        return { success: true, alreadyAccepted: true }
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

  // Функция для перенаправления на авторизацию с возвратом
  const handleAuthRedirect = useCallback(() => {
    const currentPath = window.location.pathname
    navigate(`/signin?returnTo=${encodeURIComponent(currentPath)}`)
  }, [navigate])

  // Функция присоединения к комнате
  const joinRoom = useCallback(async () => {
    if (!meeting || !userId || !isAuthenticated || isJoiningRoom) return

    setIsJoiningRoom(true)
    setJoinRequestStatus('pending')

    try {
      // Отправляем запрос через Redux
      const result = await dispatch(
        sendJoinRequest({
          roomId: meeting.id,
          userId: userId,
        })
      )

      if (sendJoinRequest.fulfilled.match(result)) {
        console.log('Join request successful:', result.payload)

        // Заявка успешно отправлена, данные уже в Redux
        const { participant } = result.payload

        // Устанавливаем статус на основе полученных данных
        const status = participant.status?.toLowerCase()
        if (
          status === 'pending' ||
          status === 'accepted' ||
          status === 'rejected'
        ) {
          setJoinRequestStatus(status)
        } else {
          setJoinRequestStatus('pending')
        }

        // Если комната публичная, попытаемся автоматически принять приглашение
        if (!meeting.privateRoom) {
          try {
            const acceptResult = await acceptInvitation(participant.id)

            if (acceptResult.success) {
              setJoinRequestStatus('accepted')
              setHasJoinedRoom(true)
              console.log('Auto-accepted for public room')
            } else {
              console.log('Auto-accept failed, staying in pending state')
            }
          } catch (acceptError) {
            console.log('Auto-accept error:', acceptError)
            // Остаемся в состоянии pending, что нормально
          }
        }

        // Обновляем данные комнаты в любом случае
        await updateRoomData()
      } else if (sendJoinRequest.rejected.match(result)) {
        console.error('Join request failed:', result.error)
        setJoinRequestStatus('rejected')
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
    dispatch,
    acceptInvitation,
    updateRoomData,
  ])

  // Сбрасываем локальное состояние при смене пользователя
  useEffect(() => {
    console.log('User changed, resetting local join states')
    setJoinRequestStatus('none')
    setHasJoinedRoom(false)
    setIsJoiningRoom(false)
    setHasJoinedWaiting(false)
  }, [userId])

  // Проверяем статус присоединения при загрузке
  useEffect(() => {
    if (meeting && isOrganizer) {
      setHasJoinedRoom(true)
      setJoinRequestStatus('accepted')
      setIsJoiningRoom(false)
    } else if (userParticipation) {
      // Если у пользователя есть заявка, устанавливаем соответствующий статус
      console.log(
        'Setting status based on userParticipation:',
        userParticipation
      )
      if (userParticipation.status === 'PENDING') {
        setJoinRequestStatus('pending')
        setIsJoiningRoom(false) // Убираем лоадер
        setHasJoinedRoom(false)
        console.log('Set status to PENDING')
      } else if (userParticipation.status === 'ACCEPTED') {
        setJoinRequestStatus('accepted')
        setHasJoinedRoom(true)
        setIsJoiningRoom(false)
        console.log('Set status to ACCEPTED')
      } else if (userParticipation.status === 'REJECTED') {
        setJoinRequestStatus('rejected')
        setIsJoiningRoom(false)
        setHasJoinedRoom(false)
        console.log('Set status to REJECTED')
      }
    } else {
      // Если нет заявки, сбрасываем статусы только если мы не в процессе присоединения
      if (!isJoiningRoom) {
        console.log('No user participation found, resetting statuses')
        setJoinRequestStatus('none')
        setHasJoinedRoom(false)
      }
    }
  }, [meeting, isOrganizer, userParticipation, isJoiningRoom])

  // Функция для уведомления сервера о присутствии пользователя в ожидании
  // TODO: Реализовать на бэкенде POST /api/room/{roomId}/join и POST /api/room/{roomId}/leave
  const notifyPresence = useCallback(
    async (roomId: number, isJoining: boolean = true) => {
      if (!userId || !isAuthenticated) return

      // Заглушка - пока API не реализован на бэкенде
      console.log(
        `Presence notification: ${
          isJoining ? 'joining' : 'leaving'
        } room ${roomId} for user ${userId}`
      )
      setHasJoinedWaiting(isJoining)

      // TODO: Uncomment when backend API is ready
      /*
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
      */
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

      // Немедленно обновляем данные комнаты для получения актуальной информации
      const updateMeetingData = async () => {
        try {
          const response = await fetch(
            `http://localhost:8080/api/room/id?roomId=${room.id}`
          )
          if (response.ok) {
            const updatedRoom = await response.json()
            const updatedMeeting = mapApiRoomToMeeting(updatedRoom)
            setMeeting(updatedMeeting)
            console.log('Initial room data loaded:', updatedMeeting)
          }
        } catch (error) {
          console.error('Error loading initial room data:', error)
        }
      }
      updateMeetingData()
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

    // Обновляем данные каждые 10 секунд
    const interval = setInterval(updateRoomData, 10000)

    return () => clearInterval(interval)
  }, [meeting, updateRoomData])

  // Функция проверки условий доступа к видеочату
  const checkChatAccess = () => {
    if (!meeting)
      return {
        hasAccess: false,
        reasons: [],
        minutesUntilStart: 0,
        conditions: {},
      }

    const startTime = meeting.startTime
      ? parseISO(meeting.startTime)
      : new Date()
    const minutesUntilStart = differenceInMinutes(startTime, currentTime)
    // Используем значение quantityParticipant с сервера напрямую
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

  const formattedStartTime = meeting.startTime
    ? format(parseISO(meeting.startTime), 'dd.MM.yyyy HH:mm')
    : 'Invalid date'
  const formattedEndTime = meeting.endTime
    ? format(parseISO(meeting.endTime), 'dd.MM.yyyy HH:mm')
    : 'Invalid date'

  // Компонент ожидания доступа к видеочату
  const renderWaitingOverlay = () => {
    if (chatAccess.hasAccess) return null

    const startTime = meeting.startTime
      ? parseISO(meeting.startTime)
      : new Date()
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
                {/* Показываем ожидающих участников */}
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
                {((hasJoinedWaiting && isAuthenticated) ||
                  userParticipation ||
                  isOrganizer) && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mt: 1,
                      pt: 1,
                      borderTop: '1px solid rgba(255,255,255,0.2)',
                      backgroundColor: isOrganizer
                        ? 'rgba(255, 193, 7, 0.2)' // Золотой для организатора
                        : userParticipation &&
                          userParticipation.status === 'PENDING'
                        ? 'rgba(255, 193, 7, 0.2)' // Желтый для pending
                        : userParticipation &&
                          userParticipation.status === 'ACCEPTED'
                        ? 'rgba(76, 175, 80, 0.2)' // Зеленый для accepted
                        : 'rgba(76, 175, 80, 0.2)', // Зеленый по умолчанию
                      borderRadius: 1,
                      px: 1,
                      py: 0.5,
                    }}
                  >
                    {isOrganizer ? (
                      <>
                        <Crown size={16} style={{ color: '#ffc107' }} />
                        <Typography variant="body2" sx={{ fontWeight: '500' }}>
                          {t('meetingChat.organizer', 'Вы организатор')}
                        </Typography>
                      </>
                    ) : userParticipation &&
                      userParticipation.status === 'PENDING' ? (
                      <>
                        <Timer size={16} style={{ color: '#ff9800' }} />
                        <Typography variant="body2" sx={{ fontWeight: '500' }}>
                          {t('meetingChat.requestPending', 'Заявка отправлена')}
                        </Typography>
                      </>
                    ) : (
                      <>
                        <CheckCircle size={16} style={{ color: '#4caf50' }} />
                        <Typography variant="body2" sx={{ fontWeight: '500' }}>
                          {userParticipation &&
                          userParticipation.status === 'ACCEPTED'
                            ? t('meetingChat.requestAccepted', 'Заявка принята')
                            : t(
                                'meetingChat.joinedWaitingRoom',
                                'Вы присоединились к ожиданию'
                              )}
                        </Typography>
                      </>
                    )}
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
        {hasJoinedRoom ||
        isOrganizer ||
        (userParticipation && userParticipation.status === 'ACCEPTED') ? (
          <Box sx={chatContainerStyle}>
            <Box sx={{ ...videoAreaStyle, position: 'relative' }}>
              <VideoChat
                roomUrl={meeting.roomUrl}
                canConnect={chatAccess.hasAccess}
              />
              {!chatAccess.hasAccess && renderWaitingOverlay()}
            </Box>
          </Box>
        ) : !isAuthenticated ? (
          // Отображение для неавторизованных пользователей
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
              <Lock size={64} style={{ opacity: 0.8 }} />
              <Typography variant="h4" fontWeight="600">
                {t('meetingChat.authRequired', 'Требуется авторизация')}
              </Typography>
              <Typography
                variant="body1"
                sx={{ opacity: 0.9, maxWidth: 500, lineHeight: 1.6 }}
              >
                {t(
                  'meetingChat.authRequiredDescription',
                  'Только зарегистрированные пользователи могут присоединяться к видеокомнатам. Пожалуйста, войдите в свой аккаунт или зарегистрируйтесь для участия в встрече.'
                )}
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={handleAuthRedirect}
                startIcon={<Lock size={20} />}
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
                }}
              >
                {t('meetingChat.authButton', 'Авторизоваться')}
              </Button>
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
              {(joinRequestStatus === 'pending' ||
                (userParticipation &&
                  userParticipation.status === 'PENDING')) && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  {userParticipation &&
                  userParticipation.status === 'PENDING' ? (
                    <CheckCircle size={48} style={{ color: '#4caf50' }} />
                  ) : (
                    <CircularProgress color="inherit" size={48} />
                  )}
                  <Typography variant="h5" fontWeight="600">
                    {userParticipation && userParticipation.status === 'PENDING'
                      ? t('meetingChat.requestSent', 'Заявка отправлена')
                      : meeting.privateRoom
                      ? t(
                          'meetingChat.waitingApproval',
                          'Waiting for approval...'
                        )
                      : t('meetingChat.joiningRoom', 'Joining room...')}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    {userParticipation && userParticipation.status === 'PENDING'
                      ? t(
                          'meetingChat.requestSentDescription',
                          'Вы успешно отправили запрос на присоединение. Ожидайте подтверждение от организатора комнаты.'
                        )
                      : meeting.privateRoom
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
                joinRequestStatus === 'rejected') &&
                !userParticipation && (
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
