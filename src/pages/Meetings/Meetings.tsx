import { useEffect, useMemo } from 'react'
import { Container, Typography, Box, Stack } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { formatDistanceStrict } from 'date-fns'
import { useTranslation } from 'react-i18next'

import { Meeting } from '../../components/MeetingCard/types'
import MeetingCard from '../../components/MeetingCard/MeetingCard'
import RoomFilter from '../../components/RoomFilter/RoomFilter'
import { boxTitleStyle, containerStyle, meetingCardStyle } from './styles'
import { fetchRooms } from '../../store/redux/roomSlice/roomSlice'
import { RootState, AppDispatch } from '../../store/store'
import { ApiRoom } from '../../store/redux/roomSlice/roomTypes'
import Loader from '../../components/Loader/Loader'

// Функция для маппинга ApiRoom в Meeting
function mapApiRoomToMeeting(apiRoom: ApiRoom): Meeting {
  const {
    id,
    topic,
    startTime,
    endTime,
    age,
    language,
    minQuantity,
    maxQuantity,
    roomUrl,
  } = apiRoom

  // Вычисляем duration
  let durationString: string | undefined = undefined
  try {
    durationString = formatDistanceStrict(
      new Date(endTime),
      new Date(startTime)
    )
  } catch (e) {
    console.error('Error calculating duration:', e)
  }

  // Генерируем slug из topic (простой пример)
  const slug = topic
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')

  return {
    id,
    slug,
    name: topic, // Используем topic как name
    category: 'General', // Placeholder, т.к. нет в ApiRoom
    startTime,
    endTime,
    duration: durationString,
    minParticipants: minQuantity,
    maxParticipants: maxQuantity,
    language,
    proficiency: 'Any', // Placeholder
    ageRestriction: age ? `${age}+` : null, // Преобразуем age
    shareLink: roomUrl, // Используем roomUrl как shareLink (или можно генерировать более сложный)
    roomUrl,
  }
}

function Meetings() {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const {
    rooms: apiRooms,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.rooms)

  useEffect(() => {
    dispatch(fetchRooms())
  }, [dispatch])

  const meetings: Meeting[] = useMemo(() => {
    if (!apiRooms) return []
    return apiRooms.map(mapApiRoomToMeeting)
  }, [apiRooms])

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

      <RoomFilter />

      <Box sx={meetingCardStyle}>
        {meetings.length > 0 ? (
          <Stack spacing={3} mt={3}>
            {meetings.map((meeting) => (
              <MeetingCard key={meeting.id} meeting={meeting} />
            ))}
          </Stack>
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
