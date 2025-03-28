import { useState } from 'react'
import { Container, Typography, Box, Stack } from '@mui/material'
import { Meeting } from '../../components/MeetingCard/types'
import MeetingCard from '../../components/MeetingCard/MeetingCard'
import RoomFilter from '../../components/RoomFilter/RoomFilter'
import { boxTitleStyle, containerStyle, meetingCardStyle } from './styles'

// Пример временных комнат
const dummyMeetings: Meeting[] = [
  {
    id: '1',
    title: 'English Conversation Club',
    category: 'Разговорный английский',
    startTime: '2025-03-25T17:00:00',
    endTime: '2025-03-25T18:00:00',
    duration: '1:00',
    minParticipants: 4,
    maxParticipants: 10,
    waitingParticipants: 6,
    language: 'en',
    proficiency: 'beginner',
    hostAvatar: '',
    ageRestriction: '18',
    shareLink: 'https://daily.fake/room-1',
  },
  {
    id: '2',
    title: 'Deutsche Diskussionsrunde',
    category: 'Deutsch lernen',
    startTime: '2025-03-26T16:00:00',
    endTime: '2025-03-26T17:30:00',
    duration: '1:30',
    minParticipants: 4,
    maxParticipants: 8,
    waitingParticipants: 2,
    language: 'de',
    proficiency: 'advanced',
    hostAvatar: '',
    ageRestriction: null,
    shareLink: 'https://daily.fake/room-2',
  },
]

function Meetings() {
  const [meetings, setMeetings] = useState<Meeting[]>(dummyMeetings)

  return (
    //<Container maxWidth="lg" sx={{ py: 4 }}>
    <Container maxWidth={false} disableGutters sx={containerStyle}>
      <Box sx={boxTitleStyle}>
        <Typography variant="h2" gutterBottom>
          Meetings
        </Typography>
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
          Join scheduled meetings or create your own room
        </Typography>
      </Box>

      <RoomFilter />

      <Box sx={meetingCardStyle}>
        <Stack spacing={3} mt={3}>
          {meetings.map((meeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} />
          ))}
        </Stack>

        {meetings.length === 0 && (
          <Box textAlign="center" mt={4}>
            <Typography variant="body1" color="text.secondary">
              Пока нет доступных комнат. Создайте первую!
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  )
}

export default Meetings
