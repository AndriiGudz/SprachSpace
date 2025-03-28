import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  Divider,
} from '@mui/material'
import { Share2, Copy } from 'lucide-react' // Удалён Flag, так как заменяем на <img>
import { format } from 'date-fns'
import { Meeting } from './types'
import {
  cardStyle,
  cardContentStyle,
  topSectionBoxStyle,
  infoBoxStyle,
  bottomSectionStyle,
  languageContainerStyle,
  ageRestrictionStyle,
  actionButtonsStyle,
  joinButtonStyle,
  participantBoxStyle,
} from './styles'

import defAvatar from '../../assets/default-avatar.png'

import enFlag from '../../assets/flag/en.png'
import deFlag from '../../assets/flag/de.png'
import ukFlag from '../../assets/flag/ua.png'
import ruFlag from '../../assets/flag/ru.png'

const defaultMeeting: Meeting = {
  id: '1',
  title: 'Cooking Master Class',
  category: 'Food',
  startTime: '2024-12-24T16:00:00',
  endTime: '2024-12-24T17:20:00',
  duration: '1:20',
  minParticipants: 4,
  maxParticipants: 12,
  waitingParticipants: 9,
  language: 'en',
  proficiency: 'beginner',
  hostAvatar: defAvatar,
  ageRestriction: null,
  shareLink: 'https://meeting-link.com/cooking-class',
}

interface MeetingCardProps {
  meeting?: Meeting
}

// Сопоставляем языковой код с нужным файлом флага
const languageFlags: Record<string, string> = {
  en: enFlag,
  de: deFlag,
  ua: ukFlag,
  ru: ruFlag,
}

function MeetingCard({ meeting = defaultMeeting }: MeetingCardProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))

  // Выбираем флаг по языку. Если для meeting.language нет записи, используется enFlag
  const languageFlag = languageFlags[meeting.language] || enFlag

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: meeting.title,
        text: `Join our meeting: ${meeting.title}`,
        url: meeting.shareLink,
      })
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(meeting.shareLink)
  }

  return (
    <Card sx={cardStyle}>
      <CardContent sx={cardContentStyle}>
        <Box
          sx={{
            ...topSectionBoxStyle,
            flexDirection: isMobile ? 'column' : 'row',
          }}
        >
          <Box sx={{ ...participantBoxStyle, width: '50%' }}>
            <Typography
              variant="body1"
              color="text.primary"
              sx={{ textDecoration: 'underline' }}
            >
              Title or Subject:
            </Typography>
            <Typography color="text.secondary">{meeting.title}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                variant="body1"
                color="text.primary"
                sx={{ textDecoration: 'underline', mr: 1 }}
              >
                Category:
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {meeting.category}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{ ...infoBoxStyle, flexDirection: isMobile ? 'column' : 'row' }}
          >
            <Box sx={participantBoxStyle}>
              <Typography
                variant="body1"
                color="text.primary"
                sx={{ textDecoration: 'underline' }}
              >
                Meeting time:
              </Typography>
              <Typography color="text.secondary">
                Start: {format(new Date(meeting.startTime), 'dd.MM.yyyy HH:mm')}
              </Typography>
              <Typography color="text.secondary">
                End: {format(new Date(meeting.endTime), 'dd.MM.yyyy HH:mm')}
              </Typography>
              <Typography color="text.secondary">
                Duration: {meeting.duration}
              </Typography>
            </Box>

            <Box sx={participantBoxStyle}>
              <Typography
                variant="body1"
                color="text.primary"
                sx={{ textDecoration: 'underline' }}
              >
                Number of participants:
              </Typography>
              <Typography color="text.secondary">
                Min: {meeting.minParticipants}
              </Typography>
              <Typography color="text.secondary">
                Max: {meeting.maxParticipants}
              </Typography>
              <Typography color="text.secondary">
                Waiting: {meeting.waitingParticipants}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* РАЗДЕЛИТЕЛЬНАЯ ЛИНИЯ */}
        <Divider sx={{ my: 2 }} />

        <Box
          sx={{ ...bottomSectionStyle, flexWrap: isMobile ? 'wrap' : 'nowrap' }}
        >
          <Box
            sx={{
              ...languageContainerStyle,
              flexWrap: isMobile ? 'wrap' : 'nowrap',
            }}
          >
            {/* Вместо иконки флага и текста – показываем одну фотографию */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={languageFlag}
                alt={`${meeting.language} flag`}
                style={{ width: 36, height: 36, marginRight: 8 }}
              />
            <Typography color="text.secondary">
              {meeting.proficiency}
            </Typography>
            </Box>


            {/* Avatar */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={meeting.hostAvatar || defAvatar}
                alt={`Avatar`}
                style={{ width: 36, height: 36, marginRight: 8 }}
              />
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Typography
                variant="body1"
                color="text.primary"
                sx={{ textDecoration: 'underline' }}
              >
                Age restriction:
              </Typography>

              {/* Если есть ограничение, показываем его со стилями, иначе - "No" */}
              {meeting.ageRestriction ? (
                <Typography variant="body1" sx={ageRestrictionStyle}>
                  {meeting.ageRestriction}+
                </Typography>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  No
                </Typography>
              )}
            </Box>

            <Box sx={actionButtonsStyle}>
              <Tooltip title="Share">
                <IconButton onClick={handleShare}>
                  <Share2 />
                </IconButton>
              </Tooltip>

              <Tooltip title="Copy link">
                <IconButton onClick={handleCopyLink}>
                  <Copy />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Box sx={actionButtonsStyle}>
            <Button
              variant="contained"
              color="primary"
              sx={joinButtonStyle}
              onClick={() => console.log('Joining meeting:', meeting.id)}
            >
              Join
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default MeetingCard
// Добавить переводы
