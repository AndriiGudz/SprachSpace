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
import advImage1 from '../../assets/advantage-1.png'
import advImage2 from '../../assets/advantage-2.png'
import advImage3 from '../../assets/advantage-3.png'
import advImage4 from '../../assets/advantage-4.png'
import ButtonMUI from '../ButtonMUI/ButtonMUI'
import LazyImage from '../LazyImage/LazyImage'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export default function WhySprachSpace() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [visibleCards, setVisibleCards] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ])
  const sectionRef = useRef<HTMLDivElement>(null)

  const handleJoinClick = () => {
    navigate('/meetings')
  }

  // Анимация появления карточек при скролле
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Показываем карточки с задержкой
            const delays = [0, 200, 400, 600]
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
      title: t('whySprachSpace.title1'),
      image: advImage1,
    },
    {
      title: t('whySprachSpace.title2'),
      image: advImage2,
    },
    {
      title: t('whySprachSpace.title3'),
      image: advImage3,
    },
    {
      title: t('whySprachSpace.title4'),
      image: advImage4,
    },
  ]

  return (
    <Box ref={sectionRef} sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" align="center" gutterBottom sx={{ mb: 6 }}>
          {t('whySprachSpace.titleBox')}
        </Typography>
        <Grid container spacing={2}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Fade in={visibleCards[index]} timeout={800}>
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
                      : 'translateY(20px)',
                    transition: 'all 0.6s ease-out',
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
                    width="222px"
                    height="222px"
                    threshold={0.2}
                    rootMargin="100px"
                    sx={{
                      borderRadius: '50%',
                      boxShadow: '0px 0px 24px 0px rgba(0, 0, 0, 0.25)',
                      margin: '24px',
                      overflow: 'hidden',
                      transition: 'transform 0.3s ease-out',
                    }}
                  />
                  <CardContent sx={{ width: '222px' }}>
                    <Typography
                      gutterBottom
                      variant="h4"
                      align="center"
                      sx={{
                        textAlign: 'center',
                      }}
                    >
                      {feature.title}
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
            text={t('whySprachSpace.buttonFree')}
            onClick={handleJoinClick}
          />
        </Box>
      </Container>
    </Box>
  )
}
