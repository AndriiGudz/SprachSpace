import { useEffect, useState } from 'react'
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
} from '@mui/material'
import { Clock, Users, Tag, Globe, Timer } from 'lucide-react'
import { format, parseISO } from 'date-fns'
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
