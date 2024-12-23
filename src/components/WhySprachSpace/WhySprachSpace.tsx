import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material'
import advImage1 from '../../assets/advantage-1.png'
import advImage2 from '../../assets/advantage-2.png'
import advImage3 from '../../assets/advantage-3.png'
import advImage4 from '../../assets/advantage-4.png'
import ButtonMUI from '../ButtonMUI/ButtonMUI'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'


export default function WhySprachSpace() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleSignInClick = () => {
    navigate('/signin')
  }

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
  ];

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" align="center" gutterBottom sx={{ mb: 6 }}>
          {t('whySprachSpace.titleBox')}
        </Typography>
        <Grid container spacing={2}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
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
                    width: '222px',
                    height: '222px',
                    objectFit: 'cover',
                    borderRadius: '50%',
                    boxShadow: '0px 0px 24px 0px rgba(0, 0, 0, 0.25)',
                    margin: '24px',
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
          <ButtonMUI text={t('whySprachSpace.buttonFree')} onClick={handleSignInClick} />
        </Box>
      </Container>
    </Box>
  )
}
