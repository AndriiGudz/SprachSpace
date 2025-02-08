import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material'

function CardSlider() {
  const { t } = useTranslation()
  const [currentIndex, setCurrentIndex] = useState(0)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))

  const getVisibleCards = () => {
    if (isMobile) return 1
    if (isTablet) return 2
    return 4
  }

  const visibleCards = getVisibleCards()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 9 - visibleCards ? 0 : prevIndex + 1
      )
    }, 3000)

    return () => clearInterval(timer)
  }, [visibleCards])

  return (
    <Box
      sx={{
        width: '100%',
        overflow: 'hidden',
        py: 6,
      }}
    >
      <Typography
        variant="h2"
        component="h2"
        sx={{
          textAlign: 'center',
          mb: 4,
        }}
      >
        {t('facts.title')}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          transition: 'transform 0.5s ease',
          transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
          gap: 2,
          px: 2,
          '& > *': {
            flex: `0 0 ${100 / visibleCards}%`,
          },
        }}
      >
        {Array.from({ length: 10 }).map((_, index) => (
          <Card
            key={index}
            sx={{
              height: 200,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 2,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-5px)',
              },
            }}
          >
            <CardContent
              sx={{
                flexGrow: 1,
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              <Typography
                variant="h4"
                component="h4"
                sx={{
                  mb: 2,
                }}
              >
                {t(`facts.items.${index}.title`)}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  lineHeight: 1.6,
                  flexGrow: 1,
                  overflow: 'hidden',
                }}
              >
                {t(`facts.items.${index}.content`)}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  )
}

export default CardSlider
