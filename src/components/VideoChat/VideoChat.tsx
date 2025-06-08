import { useEffect, useRef, useState } from 'react'
import Daily, {
  DailyCall,
  DailyEventObjectFatalError,
  DailyEventObjectParticipant,
  DailyEventObjectNoPayload,
} from '@daily-co/daily-js'
import { Box, Alert, Typography, Paper } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { VideoOff, MicOff } from 'lucide-react'

interface VideoChatProps {
  roomUrl: string
  canConnect?: boolean
}

function VideoChat({ roomUrl, canConnect = true }: VideoChatProps) {
  const { t } = useTranslation()
  const videoRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    if (!videoRef.current || !roomUrl || !canConnect) return

    let callFrame: DailyCall | null = null

    const startCall = async () => {
      try {
        if (!videoRef.current) return

        setIsConnecting(true)

        callFrame = await Daily.createFrame(videoRef.current, {
          iframeStyle: {
            width: '100%',
            height: '100%',
            border: '0',
            borderRadius: '8px',
          },
          showLeaveButton: true,
          showFullscreenButton: true,
        })

        await callFrame.join({ url: roomUrl })

        // Обработчики событий
        callFrame
          .on('left-meeting', (evt: DailyEventObjectNoPayload) => {
            setIsConnecting(false)
          })
          .on('error', (evt: DailyEventObjectFatalError) => {
            console.error('Daily.co error:', evt)
            setError(t('videoChat.error.connection'))
            setIsConnecting(false)
          })
          .on('participant-updated', (evt: DailyEventObjectParticipant) => {
            const participant = evt.participant
            if (participant?.local) {
              if (participant.audio === false) {
                setError(t('videoChat.error.microphone'))
              } else if (participant.video === false) {
                setError(t('videoChat.error.camera'))
              } else {
                setError(null)
              }
            }
          })
          .on('joined-meeting', () => {
            setIsConnecting(false)
          })
      } catch (err) {
        console.error('Failed to start video call:', err)
        setError(t('videoChat.error.general'))
        setIsConnecting(false)
      }
    }

    startCall()

    return () => {
      if (callFrame) {
        callFrame.destroy()
        setIsConnecting(false)
      }
    }
  }, [roomUrl, canConnect, t])

  // Placeholder когда подключение недоступно
  if (!canConnect) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Paper
          elevation={2}
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.paper',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              mb: 3,
              opacity: 0.5,
            }}
          >
            <VideoOff size={48} color="#666" />
            <MicOff size={48} color="#666" />
          </Box>

          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            {t('videoChat.waitingForAccess', 'Video Chat Unavailable')}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ opacity: 0.7 }}
          >
            {t(
              'videoChat.waitingDescription',
              'Camera and microphone will connect when conditions are met'
            )}
          </Typography>
        </Paper>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      {error && (
        <Alert severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      )}

      <Box
        ref={videoRef}
        sx={{
          flexGrow: 1,
          bgcolor: 'background.paper',
          borderRadius: 1,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {isConnecting && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              zIndex: 1,
            }}
          >
            <Typography variant="body1" color="text.secondary">
              {t('videoChat.connecting', 'Connecting to video chat...')}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default VideoChat
