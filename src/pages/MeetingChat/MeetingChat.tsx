import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Box, Container, Typography, Chip, Divider } from '@mui/material'
import { format, parseISO } from 'date-fns'
import { Meeting } from '../../components/MeetingCard/types'
import { RootState } from '../../store/store'
import { mapApiRoomToMeeting } from '../Meetings/Meetings'
import Loader from '../../components/Loader/Loader'
import VideoChat from '../../components/VideoChat/VideoChat'
import {
  containerStyle,
  headerStyle,
  meetingInfoStyle,
  chatContainerStyle,
  videoAreaStyle,
} from './styles'

function MeetingChat() {
  const { meetingId } = useParams()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [meeting, setMeeting] = useState<Meeting | null>(null)

  // Получаем список комнат из Redux store
  const { rooms, isLoading } = useSelector((state: RootState) => state.rooms)

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
    } else {
      // Если комната не найдена, редиректим на страницу со списком встреч
      navigate('/meetings')
    }
  }, [meetingId, rooms, navigate])

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

  return (
    <Container>
      <Box sx={containerStyle}>
        {/* Header */}
        <Box sx={headerStyle}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            color="text.primary"
          >
            {meeting.name}
          </Typography>
          {meeting.description && (
            <Typography variant="body1" color="text.secondary">
              {meeting.description}
            </Typography>
          )}
        </Box>

        {/* Meeting Info */}
        <Box sx={meetingInfoStyle}>
          <Box flex={1}>
            <Typography variant="h6" gutterBottom color="text.primary">
              {t('meetingCard.timeLabel')}
            </Typography>
            <Typography color="text.secondary">
              {t('meetingCard.startTimeLabel')} {formattedStartTime}
            </Typography>
            <Typography color="text.secondary">
              {t('meetingCard.endTimeLabel')} {formattedEndTime}
            </Typography>
            {meeting.duration && (
              <Typography color="text.secondary">
                {t('meetingCard.durationLabel')} {meeting.duration}
              </Typography>
            )}
          </Box>

          <Box flex={1}>
            <Typography variant="h6" gutterBottom color="text.primary">
              {t('meetingCard.participantsLabel')}
            </Typography>
            <Typography color="text.secondary">
              {t('meetingCard.minParticipantsLabel')} {meeting.minParticipants}
            </Typography>
            {meeting.maxParticipants && (
              <Typography color="text.secondary">
                {t('meetingCard.maxParticipantsLabel')}{' '}
                {meeting.maxParticipants}
              </Typography>
            )}
            {meeting.waitingParticipants && (
              <Typography color="text.secondary">
                {t('meetingCard.waitingParticipantsLabel')}{' '}
                {meeting.waitingParticipants}
              </Typography>
            )}
          </Box>

          <Box flex={1}>
            <Typography variant="h6" gutterBottom color="text.primary">
              {t('meetingCard.categoryLabel')}
            </Typography>
            <Chip
              label={meeting.category}
              color="primary"
              variant="outlined"
              size="small"
            />
            <Box mt={1}>
              <Chip
                label={meeting.language}
                color="secondary"
                variant="outlined"
                size="small"
              />
              {meeting.proficiency && (
                <Chip
                  label={meeting.proficiency}
                  color="info"
                  variant="outlined"
                  size="small"
                  sx={{ ml: 1 }}
                />
              )}
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Video Area */}
        <Box sx={chatContainerStyle}>
          <Box sx={videoAreaStyle}>
            <VideoChat roomUrl={meeting.roomUrl} />
          </Box>
        </Box>
      </Box>
    </Container>
  )
}

export default MeetingChat
