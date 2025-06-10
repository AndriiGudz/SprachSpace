import { useTranslation } from 'react-i18next'
import { useEffect, useMemo } from 'react'
import { Container, Typography, Box, Stack, Chip, Button } from '@mui/material'
import { ReactComponent as CalendarIcon } from '../../assets/icon/BiCalendar.svg'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store/store'
import { fetchRooms } from '../../store/redux/roomSlice/roomSlice'
import { Meeting } from '../../components/MeetingCard/types'
import MeetingCard from '../../components/MeetingCard/MeetingCard'
import Loader from '../../components/Loader/Loader'
import {
  containerStyle,
  boxTitleStyle,
  meetingCardStyle,
  filterButtonsStyle,
} from './styles'
import { mapApiRoomToMeeting } from '../Meetings/Meetings'
import { useState } from 'react'

type FilterType = 'all' | 'upcoming' | 'past' | 'created' | 'joined'

function ScheduledMeetings() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.user)
  const { rooms, isLoading, userParticipations } = useSelector(
    (state: RootState) => state.rooms
  )
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')

  // Загружаем комнаты при монтировании компонента
  useEffect(() => {
    if (user.isAuthenticated) {
      dispatch(fetchRooms() as any)
    }
  }, [dispatch, user.isAuthenticated])

  // Используем ту же функцию что и в Meetings.tsx для единообразия
  // const convertApiRoomToMeeting уже не нужна - используем mapApiRoomToMeeting

  // Получаем встречи где пользователь является организатором
  const createdMeetings = useMemo(() => {
    if (!user.id) return []
    return rooms
      .filter((room) => room.creator?.id === user.id)
      .map(mapApiRoomToMeeting)
  }, [rooms, user.id])

  // Получаем встречи где пользователь является участником
  const joinedMeetings = useMemo(() => {
    if (!user.id) return []
    return rooms
      .filter(
        (room) =>
          room.creator?.id !== user.id && // не организатор
          (userParticipations[room.id]?.status === 'ACCEPTED' || // принятые заявки
            room.participants?.some(
              (p) => p.user.id === user.id && p.status === 'ACCEPTED'
            ))
      )
      .map(mapApiRoomToMeeting)
  }, [rooms, user.id, userParticipations])

  // Определяем прошедшие встречи
  const isPastMeeting = (meeting: Meeting): boolean => {
    return new Date(meeting.endTime) < new Date()
  }

  // Все встречи пользователя
  const allMeetings = useMemo(() => {
    return [...createdMeetings, ...joinedMeetings].sort((a, b) => {
      const now = new Date()
      const aEndTime = new Date(a.endTime)
      const bEndTime = new Date(b.endTime)
      const aStartTime = new Date(a.startTime)
      const bStartTime = new Date(b.startTime)

      // Проверяем, прошла ли встреча
      const aIsPast = aEndTime < now
      const bIsPast = bEndTime < now

      // Если обе встречи прошли или обе предстоящие
      if (aIsPast === bIsPast) {
        if (aIsPast) {
          // Для прошедших встреч сортируем по времени окончания (более поздние сначала)
          return bEndTime.getTime() - aEndTime.getTime()
        } else {
          // Для предстоящих встреч сортируем по времени начала
          return aStartTime.getTime() - bStartTime.getTime()
        }
      }

      // Если одна встреча прошла, а другая нет
      return aIsPast ? 1 : -1
    })
  }, [createdMeetings, joinedMeetings])

  // Фильтрованные встречи в зависимости от активного фильтра
  const filteredMeetings = useMemo(() => {
    switch (activeFilter) {
      case 'upcoming':
        return allMeetings.filter((m) => !isPastMeeting(m))
      case 'past':
        return allMeetings.filter((m) => isPastMeeting(m))
      case 'created':
        return createdMeetings
      case 'joined':
        return joinedMeetings
      default:
        return allMeetings
    }
  }, [allMeetings, createdMeetings, joinedMeetings, activeFilter])

  const handleCreateMeeting = () => {
    navigate('/meetings')
  }

  // Подсчет для каждого фильтра
  const filterCounts = useMemo(() => {
    const upcoming = allMeetings.filter((m) => !isPastMeeting(m)).length
    const past = allMeetings.filter((m) => isPastMeeting(m)).length

    return {
      all: allMeetings.length,
      upcoming,
      past,
      created: createdMeetings.length,
      joined: joinedMeetings.length,
    }
  }, [allMeetings, createdMeetings, joinedMeetings])

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
          <CalendarIcon style={{ width: 32, height: 32, color: '#1976d2' }} />
          <Typography variant="h2" gutterBottom>
            {t('userMenu.scheduledMeetings')}
          </Typography>
        </Box>
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
          {t('scheduledMeetings.description')}
        </Typography>
      </Box>

      {/* Красивые фильтры в виде чипов */}
      <Box sx={filterButtonsStyle}>
        <Chip
          label={`${t('scheduledMeetings.filters.all')} (${filterCounts.all})`}
          onClick={() => setActiveFilter('all')}
          variant={activeFilter === 'all' ? 'filled' : 'outlined'}
          color={activeFilter === 'all' ? 'primary' : 'default'}
          sx={{
            fontSize: '0.875rem',
            height: 40,
            minWidth: 'auto',
            whiteSpace: 'nowrap',
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
          label={`${t('scheduledMeetings.filters.upcoming')} (${
            filterCounts.upcoming
          })`}
          onClick={() => setActiveFilter('upcoming')}
          variant={activeFilter === 'upcoming' ? 'filled' : 'outlined'}
          color={activeFilter === 'upcoming' ? 'success' : 'default'}
          sx={{
            fontSize: '0.875rem',
            height: 40,
            minWidth: 'auto',
            whiteSpace: 'nowrap',
            backdropFilter: 'blur(10px)',
            background:
              activeFilter === 'upcoming'
                ? 'rgba(46, 125, 50, 0.8)'
                : 'rgba(255, 255, 255, 0.3)',
            border:
              activeFilter === 'upcoming'
                ? '1px solid rgba(46, 125, 50, 0.4)'
                : '1px solid rgba(255, 255, 255, 0.4)',
            color: activeFilter === 'upcoming' ? '#fff' : 'inherit',
            transition: 'all 0.3s ease',
            transform:
              activeFilter === 'upcoming'
                ? 'translateY(-1px)'
                : 'translateY(0px)',
            boxShadow:
              activeFilter === 'upcoming'
                ? '0 6px 20px rgba(46, 125, 50, 0.25)'
                : '0 3px 12px rgba(0, 0, 0, 0.15)',
            '&:hover': {
              background:
                activeFilter === 'upcoming'
                  ? 'rgba(46, 125, 50, 0.9)'
                  : 'rgba(255, 255, 255, 0.4)',
              transform: 'translateY(-3px)',
              boxShadow:
                activeFilter === 'upcoming'
                  ? '0 8px 25px rgba(46, 125, 50, 0.4)'
                  : '0 6px 20px rgba(0, 0, 0, 0.2)',
            },
          }}
        />
        <Chip
          label={`${t('scheduledMeetings.filters.past')} (${
            filterCounts.past
          })`}
          onClick={() => setActiveFilter('past')}
          variant={activeFilter === 'past' ? 'filled' : 'outlined'}
          color={activeFilter === 'past' ? 'secondary' : 'default'}
          sx={{
            fontSize: '0.875rem',
            height: 40,
            minWidth: 'auto',
            whiteSpace: 'nowrap',
            backdropFilter: 'blur(10px)',
            background:
              activeFilter === 'past'
                ? 'rgba(156, 39, 176, 0.8)'
                : 'rgba(255, 255, 255, 0.3)',
            border:
              activeFilter === 'past'
                ? '1px solid rgba(156, 39, 176, 0.4)'
                : '1px solid rgba(255, 255, 255, 0.4)',
            color: activeFilter === 'past' ? '#fff' : 'inherit',
            transition: 'all 0.3s ease',
            transform:
              activeFilter === 'past' ? 'translateY(-1px)' : 'translateY(0px)',
            boxShadow:
              activeFilter === 'past'
                ? '0 6px 20px rgba(156, 39, 176, 0.25)'
                : '0 3px 12px rgba(0, 0, 0, 0.15)',
            '&:hover': {
              background:
                activeFilter === 'past'
                  ? 'rgba(156, 39, 176, 0.9)'
                  : 'rgba(255, 255, 255, 0.4)',
              transform: 'translateY(-3px)',
              boxShadow:
                activeFilter === 'past'
                  ? '0 8px 25px rgba(156, 39, 176, 0.4)'
                  : '0 6px 20px rgba(0, 0, 0, 0.2)',
            },
          }}
        />
        <Chip
          label={`${t('scheduledMeetings.filters.created')} (${
            filterCounts.created
          })`}
          onClick={() => setActiveFilter('created')}
          variant={activeFilter === 'created' ? 'filled' : 'outlined'}
          color={activeFilter === 'created' ? 'info' : 'default'}
          sx={{
            fontSize: '0.875rem',
            height: 40,
            minWidth: 'auto',
            whiteSpace: 'nowrap',
            backdropFilter: 'blur(10px)',
            background:
              activeFilter === 'created'
                ? 'rgba(2, 136, 209, 0.8)'
                : 'rgba(255, 255, 255, 0.3)',
            border:
              activeFilter === 'created'
                ? '1px solid rgba(2, 136, 209, 0.4)'
                : '1px solid rgba(255, 255, 255, 0.4)',
            color: activeFilter === 'created' ? '#fff' : 'inherit',
            transition: 'all 0.3s ease',
            transform:
              activeFilter === 'created'
                ? 'translateY(-1px)'
                : 'translateY(0px)',
            boxShadow:
              activeFilter === 'created'
                ? '0 6px 20px rgba(2, 136, 209, 0.25)'
                : '0 3px 12px rgba(0, 0, 0, 0.15)',
            '&:hover': {
              background:
                activeFilter === 'created'
                  ? 'rgba(2, 136, 209, 0.9)'
                  : 'rgba(255, 255, 255, 0.4)',
              transform: 'translateY(-3px)',
              boxShadow:
                activeFilter === 'created'
                  ? '0 8px 25px rgba(2, 136, 209, 0.4)'
                  : '0 6px 20px rgba(0, 0, 0, 0.2)',
            },
          }}
        />
        <Chip
          label={`${t('scheduledMeetings.filters.joined')} (${
            filterCounts.joined
          })`}
          onClick={() => setActiveFilter('joined')}
          variant={activeFilter === 'joined' ? 'filled' : 'outlined'}
          color={activeFilter === 'joined' ? 'warning' : 'default'}
          sx={{
            fontSize: '0.875rem',
            height: 40,
            minWidth: 'auto',
            whiteSpace: 'nowrap',
            backdropFilter: 'blur(10px)',
            background:
              activeFilter === 'joined'
                ? 'rgba(237, 108, 2, 0.8)'
                : 'rgba(255, 255, 255, 0.3)',
            border:
              activeFilter === 'joined'
                ? '1px solid rgba(237, 108, 2, 0.4)'
                : '1px solid rgba(255, 255, 255, 0.4)',
            color: activeFilter === 'joined' ? '#fff' : 'inherit',
            transition: 'all 0.3s ease',
            transform:
              activeFilter === 'joined'
                ? 'translateY(-1px)'
                : 'translateY(0px)',
            boxShadow:
              activeFilter === 'joined'
                ? '0 6px 20px rgba(237, 108, 2, 0.25)'
                : '0 3px 12px rgba(0, 0, 0, 0.15)',
            '&:hover': {
              background:
                activeFilter === 'joined'
                  ? 'rgba(237, 108, 2, 0.9)'
                  : 'rgba(255, 255, 255, 0.4)',
              transform: 'translateY(-3px)',
              boxShadow:
                activeFilter === 'joined'
                  ? '0 8px 25px rgba(237, 108, 2, 0.4)'
                  : '0 6px 20px rgba(0, 0, 0, 0.2)',
            },
          }}
        />
      </Box>

      <Box sx={meetingCardStyle}>
        {filteredMeetings.length > 0 ? (
          <Stack spacing={3} mt={3}>
            {filteredMeetings.map((meeting) => {
              const isPast = isPastMeeting(meeting)
              return (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  isPast={isPast}
                />
              )
            })}
          </Stack>
        ) : (
          <Box textAlign="center" mt={4}>
            <CalendarIcon
              style={{ width: 64, height: 64, color: '#ccc', marginBottom: 16 }}
            />
            <Typography variant="h6" gutterBottom>
              {activeFilter === 'past'
                ? t('scheduledMeetings.noPastMeetings')
                : t('scheduledMeetings.noMeetings')}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {t('scheduledMeetings.noMeetingsDescription')}
            </Typography>
            <Button variant="contained" onClick={handleCreateMeeting}>
              {t('scheduledMeetings.createFirst')}
            </Button>
          </Box>
        )}
      </Box>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button variant="outlined" onClick={handleCreateMeeting} size="large">
          {t('scheduledMeetings.findMoreMeetings')}
        </Button>
      </Box>
    </Container>
  )
}

export default ScheduledMeetings
