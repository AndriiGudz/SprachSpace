import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Fade,
} from '@mui/material'
import { useState, useEffect, useRef } from 'react'
import advImage1 from '../../assets/poly-reg.png'
import advImage2 from '../../assets/poly-newroom.png'
import advImage3 from '../../assets/poly-comm.png'
import ButtonMUI from '../ButtonMUI/ButtonMUI'
import LazyImage from '../LazyImage/LazyImage'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export default function HowItWorks() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [visibleCards, setVisibleCards] = useState<boolean[]>([
    false,
    false,
    false,
  ])
  const sectionRef = useRef<HTMLDivElement>(null)

  const handleStartClick = () => {
    navigate('/meetings')
  }

  // Анимация появления карточек при скролле
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Показываем карточки с задержкой
            const delays = [0, 300, 600]
            delays.forEach((delay, index) => {
              setTimeout(() => {
                setVisibleCards((prev) => {
                  const newVisible = [...prev]
                  newVisible[index] = true
                  return newVisible
                })
              }, delay)
            })
            observer.disconnect()
          }
        })
      },
      {
        threshold: 0.2,
        rootMargin: '50px',
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const features = [
    {
      title: t('howItWorks.title1'),
      description: t('howItWorks.description1'),
      image: advImage1,
    },
    {
      title: t('howItWorks.title2'),
      description: t('howItWorks.description1'),
      image: advImage2,
    },
    {
      title: t('howItWorks.title3'),
      description: t('howItWorks.description1'),
      image: advImage3,
    },
  ]

  return (
    <Box ref={sectionRef} sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" align="center" gutterBottom sx={{ mb: 2 }}>
          {t('howItWorks.titleBox')}
        </Typography>
        <Typography variant="subtitle1" align="center" sx={{ mb: 3 }}>
          {t('howItWorks.subtitleBox')}
        </Typography>
        <Grid container spacing={2}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={12} md={4} key={index}>
              <Fade in={visibleCards[index]} timeout={1000}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    boxShadow: 'none',
                    background: 'transparent',
                    transform: visibleCards[index]
                      ? 'translateY(0)'
                      : 'translateY(30px)',
                    transition: 'all 0.8s ease-out',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      '& img': {
                        transform: 'scale(1.05)',
                      },
                    },
                  }}
                >
                  <LazyImage
                    src={feature.image}
                    alt={feature.title}
                    width="282px"
                    height="auto"
                    threshold={0.2}
                    rootMargin="100px"
                    sx={{
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease-out',
                    }}
                  />

                  <CardContent sx={{ width: '282px' }}>
                    <Typography
                      gutterBottom
                      variant="h4"
                      align="center"
                      sx={{
                        textAlign: 'start',
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography variant="subtitle1">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '32px',
          }}
        >
          <ButtonMUI
            text={t('howItWorks.buttonBegin')}
            onClick={handleStartClick}
          />
        </Box>
      </Container>
    </Box>
  )
}
