import { useTranslation } from 'react-i18next'
import { useEffect, useMemo } from 'react'
import { Container, Typography, Box, Stack, Chip, Button } from '@mui/material'
import { ReactComponent as CalendarIcon } from '../../assets/icon/BiCalendar.svg'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store/store'
import { fetchRoomStatusesByUser } from '../../store/redux/roomSlice/roomSlice'
import { Meeting } from '../../components/MeetingCard/types'
import MeetingCardWithCreator from '../../components/MeetingCard/MeetingCardWithCreator'
import Loader from '../../components/Loader/Loader'
import {
  containerStyle,
  boxTitleStyle,
  meetingCardStyle,
  filterButtonsStyle,
} from './styles'
import { mapApiRoomToMeeting } from '../Meetings/Meetings'
import { useState } from 'react'
import { CreateRoomButton } from '../../components/CreateRoomButton/CreateRoomButton'

type FilterType = 'all' | 'upcoming' | 'past' | 'created' | 'joined'

function ScheduledMeetings() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.user)
  const { rooms, isLoading, roomStatuses } = useSelector(
    (state: RootState) => state.rooms
  )
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')

  function getIds(list: Meeting[]): number[] {
    return list.map((m) => m.id)
  }

  function findDuplicateIds(ids: number[]): number[] {
    const seen = new Set<number>()
    const dups = new Set<number>()
    ids.forEach((id) => {
      if (seen.has(id)) dups.add(id)
      else seen.add(id)
    })
    return Array.from(dups)
  }

  // Загружаем комнаты при монтировании компонента
  useEffect(() => {
    if (user.isAuthenticated && user.id) {
      dispatch(fetchRoomStatusesByUser(user.id) as any)
    }
  }, [dispatch, user.isAuthenticated, user.id])

  // Используем ту же функцию что и в Meetings.tsx для единообразия
  // const convertApiRoomToMeeting уже не нужна - используем mapApiRoomToMeeting

  // Получаем встречи где пользователь является организатором
  const createdMeetings = useMemo(() => {
    if (!user.id) return []
    const idsFromStatuses = Object.keys(roomStatuses || {}).map((k) =>
      Number(k)
    )
    const roomsFromStatuses = rooms.filter((r) =>
      idsFromStatuses.includes(r.id)
    )
    return roomsFromStatuses
      .filter(
        (room) =>
          room.creator?.id === user.id ||
          roomStatuses?.[room.id]?.type === 'CREATOR'
      )
      .map(mapApiRoomToMeeting)
  }, [rooms, user.id, roomStatuses])

  // Получаем встречи где пользователь является участником
  const joinedMeetings = useMemo(() => {
    if (!user.id) return []
    const idsFromStatuses = Object.keys(roomStatuses || {}).map((k) =>
      Number(k)
    )
    const roomsFromStatuses = rooms.filter((r) =>
      idsFromStatuses.includes(r.id)
    )
    return roomsFromStatuses
      .filter((room) => {
        const statusItem = roomStatuses?.[room.id]
        if (!statusItem) return false
        if (room.creator?.id === user.id) return false
        // статус не учитываем. Участник — по типам заявки/приглашения
        return (
          statusItem.type === 'REQUESTED_BY_USER' ||
          statusItem.type === 'INVITED_BY_CREATOR' ||
          statusItem.type === 'INVITED_BY_ORGANIZER'
        )
      })
      .map(mapApiRoomToMeeting)
  }, [rooms, user.id, roomStatuses])

  // Определяем прошедшие встречи
  const isPastMeeting = (meeting: Meeting): boolean => {
    return new Date(meeting.endTime) < new Date()
  }

  // Все встречи пользователя
  const allMeetings = useMemo(() => {
    const merged = [...createdMeetings, ...joinedMeetings]
    const uniqueById = new Map<number, Meeting>()
    merged.forEach((m) => {
      if (typeof m.id === 'number') uniqueById.set(m.id, m)
    })
    const deduped = Array.from(uniqueById.values())

    return deduped.sort((a, b) => {
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

  useEffect(() => {
    const roomsIds = rooms.map((r) => r.id)
    const createdIds = getIds(createdMeetings)
    const joinedIds = getIds(joinedMeetings)
    const allIdsBefore = [...createdIds, ...joinedIds]
    const duplicatesBefore = findDuplicateIds(allIdsBefore)
    const filteredIds = getIds(filteredMeetings)
    const duplicatesFiltered = findDuplicateIds(filteredIds)

    console.groupCollapsed('[ScheduledMeetings] debug')
    console.log('userId:', user.id, 'isAuthenticated:', user.isAuthenticated)
    console.log(
      'roomStatuses keys:',
      Object.keys(roomStatuses || {}).length,
      roomStatuses
    )
    console.log('rooms len:', rooms.length, 'ids:', roomsIds)
    console.log('created len:', createdMeetings.length, 'ids:', createdIds)
    console.log('joined len:', joinedMeetings.length, 'ids:', joinedIds)
    console.log(
      'all (before dedup) len:',
      allIdsBefore.length,
      'dupIds:',
      duplicatesBefore
    )
    console.log('allMeetings (after dedup) len:', allMeetings.length)
    console.log(
      'activeFilter:',
      activeFilter,
      'filtered len:',
      filteredMeetings.length,
      'dupIds in filtered:',
      duplicatesFiltered
    )
    console.groupEnd()
  }, [
    rooms,
    roomStatuses,
    createdMeetings,
    joinedMeetings,
    allMeetings,
    filteredMeetings,
    activeFilter,
    user.id,
    user.isAuthenticated,
  ])

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
                <MeetingCardWithCreator
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
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CreateRoomButton
                buttonText={t('scheduledMeetings.createFirst')}
              />
            </Box>
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
