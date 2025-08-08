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

// Функция для маппинга ApiRoom в Meeting
export function mapApiRoomToMeeting(apiRoom: ApiRoom): Meeting {
  if (!apiRoom) {
    console.error('mapApiRoomToMeeting - apiRoom is undefined')
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
    } catch (e) {
      console.error('Error calculating duration:', e)
    }
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

  const filteredMeetings = useMemo(() => {
    if (!apiRooms) return []

    const mappedMeetings = apiRooms.map(mapApiRoomToMeeting)

    return mappedMeetings
      .filter((meeting) => {
        const meetingDate = new Date(meeting.startTime)
          .toISOString()
          .split('T')[0]

        // Сравниваем значения, приводя их к нижнему регистру
        const categoryMatch =
          !activeFilters.category ||
          meeting.category.toLowerCase() ===
            activeFilters.category.toLowerCase()

        const languageMatch =
          !activeFilters.language ||
          meeting.language.toLowerCase() ===
            activeFilters.language.toLowerCase()

        const proficiencyMatch =
          !activeFilters.proficiency ||
          meeting.proficiency?.toLowerCase() ===
            activeFilters.proficiency.toLowerCase()

        const dateMatch =
          !activeFilters.date || meetingDate === activeFilters.date

        return categoryMatch && languageMatch && proficiencyMatch && dateMatch
      })
      .sort((a, b) => {
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
  }, [apiRooms, activeFilters])

  // Pagination calculations
  const totalPages = Math.ceil(filteredMeetings.length / itemsPerPage)
  const startIndex = (page - 1) * itemsPerPage
  const paginatedMeetings = filteredMeetings.slice(
    startIndex,
    startIndex + itemsPerPage
  )

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
        {filteredMeetings.length > 0 ? (
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
