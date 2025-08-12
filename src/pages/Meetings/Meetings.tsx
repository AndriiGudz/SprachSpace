import { useEffect, useMemo, useState } from 'react'
import {
  Container,
  Typography,
  Box,
  Stack,
  Pagination,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { formatDistanceStrict } from 'date-fns'
import { useTranslation } from 'react-i18next'

import { Meeting } from '../../components/MeetingCard/types'
import MeetingCardWithCreator from '../../components/MeetingCard/MeetingCardWithCreator'
import RoomFilter, { RoomFilters } from '../../components/RoomFilter/RoomFilter'
import { boxTitleStyle, containerStyle, meetingCardStyle } from './styles'
import { fetchRooms } from '../../store/redux/roomSlice/roomSlice'
import { RootState, AppDispatch } from '../../store/store'
import { ApiRoom } from '../../store/redux/roomSlice/roomTypes'
import Loader from '../../components/Loader/Loader'
import { prefetchUsers } from '../../hooks/useUserData'

// Функция для маппинга ApiRoom в Meeting
export function mapApiRoomToMeeting(apiRoom: ApiRoom): Meeting {
  if (!apiRoom) {
    throw new Error('ApiRoom is undefined')
  }

  const {
    id,
    topic,
    startTime,
    endTime,
    duration,
    age,
    language,
    languageLvl,
    minQuantity,
    maxQuantity,
    quantityParticipant,
    roomUrl,
    category,
    privateRoom,
    creator,
    participants,
    roomOnlineUsers,
    countOnlineUser,
  } = apiRoom

  let durationString: string | undefined = undefined
  if (typeof duration === 'number') {
    const hours = Math.floor(duration / 60)
    const minutes = duration % 60
    durationString = ''
    if (hours > 0) durationString += `${hours}h `
    if (minutes > 0 || hours === 0) durationString += `${minutes}m`
    durationString = durationString.trim()
    if (durationString === '' && duration === 0) durationString = '0m'
  } else if (startTime && endTime) {
    try {
      durationString = formatDistanceStrict(
        new Date(endTime),
        new Date(startTime)
      )
    } catch (e) {}
  }

  const slug = (topic || 'unknown')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')

  const meetingData: Meeting = {
    id: id || 0,
    slug,
    name: topic || 'Unknown',
    // Категория может приходить как объект { id, name } или как строка categoryName в других эндпоинтах
    // Нормализуем к видимому названию категории
    category:
      (category as any)?.name || (apiRoom as any)?.categoryName || 'Unknown',
    startTime: startTime || new Date().toISOString(),
    endTime: endTime || new Date().toISOString(),
    duration: durationString,
    minParticipants: minQuantity || 0,
    maxParticipants: maxQuantity || 0,
    waitingParticipants: quantityParticipant || 0,
    language: language || 'Unknown',
    proficiency: languageLvl,
    ageRestriction: typeof age === 'string' ? parseInt(age, 10) : age,
    shareLink: roomUrl || '',
    roomUrl: roomUrl || '',
    privateRoom: privateRoom || false,
    creator: creator, // Сохраняем creator для последующей обработки
    description: undefined,
    imageUrl: undefined,
    languageFlagIconUrl: undefined,
    location: undefined,
    participants: participants || undefined,
    roomOnlineUsers: roomOnlineUsers || undefined,
    countOnlineUser: countOnlineUser || 0,
  }
  return meetingData
}

function Meetings() {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const {
    rooms: apiRooms,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.rooms)

  // Pagination state
  const [page, setPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(8)

  // Filter state
  const [activeFilters, setActiveFilters] = useState<RoomFilters>({
    category: '',
    language: '',
    proficiency: '',
    date: '',
  })

  useEffect(() => {
    dispatch(fetchRooms())
  }, [dispatch])

  // Фильтрация и сортировка по ApiRoom; маппинг в Meeting только для текущей страницы
  const { paginatedMeetings, filteredCount, pageCreatorIds } = useMemo(() => {
    const empty = {
      paginatedMeetings: [] as Meeting[],
      filteredCount: 0,
      pageCreatorIds: [] as number[],
    }
    if (!apiRooms || apiRooms.length === 0) return empty

    const categoryFilter = (activeFilters.category || '').toLowerCase()
    const languageFilter = (activeFilters.language || '').toLowerCase()
    const proficiencyFilter = (activeFilters.proficiency || '').toLowerCase()
    const dateFilter = activeFilters.date || ''

    const filteredSortedRooms = apiRooms
      .filter((room) => {
        const roomCategoryName = (
          room.category?.name ||
          room.categoryName ||
          ''
        ).toLowerCase()
        const roomLanguage = (room.language || '').toLowerCase()
        const roomProficiency = (room.languageLvl || '').toLowerCase()
        const roomDate = new Date(room.startTime).toISOString().split('T')[0]

        if (categoryFilter && roomCategoryName !== categoryFilter) return false
        if (languageFilter && roomLanguage !== languageFilter) return false
        if (proficiencyFilter && roomProficiency !== proficiencyFilter)
          return false
        if (dateFilter && roomDate !== dateFilter) return false
        return true
      })
      .sort((a, b) => {
        const now = Date.now()
        const aEnd = new Date(a.endTime).getTime()
        const bEnd = new Date(b.endTime).getTime()
        const aStart = new Date(a.startTime).getTime()
        const bStart = new Date(b.startTime).getTime()

        const aIsPast = aEnd < now
        const bIsPast = bEnd < now
        if (aIsPast === bIsPast) {
          return aIsPast ? bEnd - aEnd : aStart - bStart
        }
        return aIsPast ? 1 : -1
      })

    const total = filteredSortedRooms.length
    const start = (page - 1) * itemsPerPage
    const end = start + itemsPerPage
    const pageRooms = filteredSortedRooms.slice(start, end)

    // Маппим только видимые элементы
    const meetings = pageRooms.map(mapApiRoomToMeeting)
    // ID организаторов текущей страницы (если есть)
    const creatorIds = pageRooms
      .map((room) =>
        room.creator && typeof room.creator.id === 'number'
          ? room.creator.id
          : null
      )
      .filter((id): id is number => id !== null)

    return {
      paginatedMeetings: meetings,
      filteredCount: total,
      pageCreatorIds: creatorIds,
    }
  }, [apiRooms, activeFilters, page, itemsPerPage])

  const totalPages = Math.max(1, Math.ceil(filteredCount / itemsPerPage))

  // Префетчим организаторов для карточек текущей страницы
  useEffect(() => {
    if (pageCreatorIds && pageCreatorIds.length > 0) {
      prefetchUsers(pageCreatorIds).catch(() => {})
    }
  }, [pageCreatorIds])

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value)
  }

  const handleItemsPerPageChange = (event: any) => {
    const newItemsPerPage = parseInt(event.target.value)
    setItemsPerPage(newItemsPerPage)
    setPage(1)
  }

  const handleFiltersChange = (filters: RoomFilters) => {
    setActiveFilters(filters)
    setPage(1)
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

  if (error) {
    return (
      <Container sx={{ ...containerStyle, textAlign: 'center', py: 4 }}>
        <Typography variant="h5" color="error">
          {t('meetings.error.title')}
        </Typography>
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth={false} disableGutters sx={containerStyle}>
      <Box sx={boxTitleStyle}>
        <Typography variant="h2" gutterBottom>
          {t('meetings.title')}
        </Typography>
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
          {t('meetings.subtitle')}
        </Typography>
      </Box>

      <RoomFilter onFiltersChange={handleFiltersChange} />

      <Box sx={meetingCardStyle}>
        {filteredCount > 0 ? (
          <>
            <Stack spacing={3} mt={3}>
              {paginatedMeetings.map((meeting) => {
                const isPast = new Date(meeting.endTime) < new Date()
                return (
                  <Box
                    key={meeting.id}
                    sx={{
                      opacity: isPast ? 0.7 : 1,
                      backgroundColor: isPast
                        ? 'rgba(0, 0, 0, 0.04)'
                        : 'transparent',
                      transition: 'all 0.3s ease',
                      cursor: isPast ? 'default' : 'pointer',
                      '&:hover': {
                        transform: isPast ? 'none' : 'translateY(-2px)',
                        boxShadow: isPast
                          ? 'none'
                          : '0 4px 8px rgba(0, 0, 0, 0.1)',
                      },
                    }}
                  >
                    <MeetingCardWithCreator meeting={meeting} isPast={isPast} />
                  </Box>
                )
              })}
            </Stack>
            <Box
              sx={{
                mt: 4,
                mb: 2,
                px: 2,
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'stretch', md: 'center' },
                gap: { xs: 2, md: 0 },
              }}
            >
              <FormControl
                variant="outlined"
                size="small"
                sx={{
                  minWidth: 200,
                  alignSelf: { xs: 'stretch', md: 'flex-end' },
                  order: { xs: 1, md: 2 },
                }}
              >
                <InputLabel
                  id="items-per-page-label"
                  sx={{ fontSize: '0.875rem' }}
                >
                  {t('meetings.pagination.itemsPerPage')}
                </InputLabel>
                <Select
                  id="items-per-page-select"
                  labelId="items-per-page-label"
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  label={t('meetings.pagination.itemsPerPage')}
                  aria-labelledby="items-per-page-label"
                  data-value={itemsPerPage}
                  sx={{ fontSize: '0.875rem' }}
                >
                  <MenuItem value={8}>8</MenuItem>
                  <MenuItem value={16}>16</MenuItem>
                </Select>
              </FormControl>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: { xs: 'center' },
                  gap: 1,
                  order: { xs: 2, md: 1 },
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: { xs: 'center', md: 'left' } }}
                >
                  {t('meetings.pagination.page')} {page}{' '}
                  {t('meetings.pagination.of')} {totalPages}
                </Typography>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size="small"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      fontSize: '0.875rem',
                    },
                  }}
                />
              </Box>
            </Box>
          </>
        ) : (
          <Box textAlign="center" mt={4}>
            <Typography variant="body1" color="text.secondary">
              {t('meetings.noRooms')}
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  )
}

export default Meetings
