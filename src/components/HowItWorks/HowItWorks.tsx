import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material'
import advImage1 from '../../assets/poly-reg.png'
import advImage2 from '../../assets/poly-newroom.png'
import advImage3 from '../../assets/poly-comm.png'
import ButtonMUI from '../ButtonMUI/ButtonMUI'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export default function HowItWorks() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleSignInClick = () => {
    navigate('/signin')
  }

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
    <Box sx={{ py: 8 }}>
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
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  boxShadow: 'none',
                  background: 'transparent',
                }}
              >
                <CardMedia
                  component="img"
                  image={feature.image}
                  alt={feature.title}
                  sx={{
                    objectFit: 'cover',
                    width: '282px',
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
            onClick={handleSignInClick}
          />
        </Box>
      </Container>
    </Box>
  )
}
