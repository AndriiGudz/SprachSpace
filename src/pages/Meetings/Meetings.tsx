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
    duration,
    age,
    language,
    languageLvl,
    minQuantity,
    maxQuantity,
    roomUrl,
    category,
    privateRoom,
    creator,
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

  const slug = topic
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')

  const meetingData: Meeting = {
    id,
    slug,
    name: topic,
    category: category.name,
    startTime,
    endTime,
    duration: durationString,
    minParticipants: minQuantity,
    maxParticipants: maxQuantity,
    language,
    proficiency: languageLvl,
    ageRestriction: typeof age === 'string' ? parseInt(age, 10) : age,
    shareLink: roomUrl,
    roomUrl,
    privateRoom,
    organizer: creator
      ? {
          name: creator.nickname || creator.name,
          nickname: creator.nickname,
          firstName: creator.name,
          lastName: creator.surname,
          avatarUrl: creator.foto || undefined,
          rating: creator.rating,
        }
      : undefined,
    description: undefined,
    waitingParticipants: undefined,
    imageUrl: undefined,
    languageFlagIconUrl: undefined,
    location: undefined,
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
