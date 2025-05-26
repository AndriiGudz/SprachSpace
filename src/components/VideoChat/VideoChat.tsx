import { useEffect, useRef, useState } from 'react'
import Daily, {
  DailyCall,
  DailyEventObjectFatalError,
  DailyEventObjectParticipant,
  DailyEventObjectNoPayload,
} from '@daily-co/daily-js'
import { Box, Alert } from '@mui/material'
import { useTranslation } from 'react-i18next'

interface VideoChatProps {
  roomUrl: string
}

function VideoChat({ roomUrl }: VideoChatProps) {
  const { t } = useTranslation()
  const videoRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!videoRef.current || !roomUrl) return

    let callFrame: DailyCall | null = null

    const startCall = async () => {
      try {
        if (!videoRef.current) return

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
            console.log('User left the meeting')
          })
          .on('error', (evt: DailyEventObjectFatalError) => {
            console.error('Daily.co error:', evt)
            setError(t('videoChat.error.connection'))
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
      } catch (err) {
        console.error('Failed to start video call:', err)
        setError(t('videoChat.error.general'))
      }
    }

    startCall()

    return () => {
      if (callFrame) {
        callFrame.destroy()
      }
    }
  }, [roomUrl, t])

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
        }}
      />
    </Box>
  )
}

export default VideoChat
