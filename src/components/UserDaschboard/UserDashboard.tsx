import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Paper,
  Typography,
} from '@mui/material'
import { UserSliceState, LanguageData } from '../../store/redux/userSlice/types'
import Loader from '../Loader/Loader'

interface UserDashboardProps {
  userId: string | undefined
}

function UserDashboard({ userId }: UserDashboardProps) {
  const { t } = useTranslation()
  const [user, setUser] = useState<UserSliceState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setError('User ID is required')
      setLoading(false)
      return
    }

    fetch(`http://localhost:8080/api/users/${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('User not found')
        }
        return response.json()
      })
      .then((data) => {
        setUser(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setError(err.message)
        setLoading(false)
      })
  }, [userId])

  if (loading) return <Loader />
  if (error) return <Typography color="error">{error}</Typography>
  if (!user) return <Typography>{t('userDashboard.noData')}</Typography>

  // Статистика пользователя
  const userStats = [
    { label: t('userDashboard.points'), value: user.internalCurrency || 0 },
    { label: t('userDashboard.reviews'), value: '10' },
    {
      label: t('userDashboard.roomCreated'),
      value: user.createdRooms.length.toString(),
    },
    { label: t('userDashboard.roomAttended'), value: '5' },
    { label: t('userDashboard.rating'), value: user.rating },
  ]

  // Информация о языках
  const languageInfo = [
    {
      label: t('userDashboard.nativeLanguages'),
      value: user.nativeLanguages
        .map((l: LanguageData) => l.language.name)
        .join(', '),
    },
    {
      label: t('userDashboard.learningLanguages'),
      value: user.learningLanguages
        .map((l: LanguageData) => l.language.name)
        .join(', '),
    },
  ]

  return (
    <Box>
      <Container
        maxWidth="lg"
        sx={{
          maxWidth: { lg: '1200px' },
          width: { lg: '1200px' },
        }}
      >
        <Card
          sx={{
            mt: { xs: 2, md: 4 },
            borderRadius: '4px',
            boxShadow: '0px 0px 24px 0px rgba(0, 0, 0, 0.25)',
          }}
        >
          <CardContent sx={{ p: { xs: 2, md: 4 } }}>
            {/* Avatar Section */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Avatar
                src={user.foto || ''}
                alt={`${user.nickname} avatar`}
                sx={{ width: 100, height: 100, p: 2 }}
              />
            </Box>

            {/* Stats Section */}
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 2,
                mb: 2,
              }}
            >
              {userStats.map((stat, index) => (
                <Box key={index}>
                  <Paper
                    elevation={0}
                    sx={{
                      padding: '16px 40px',
                      textAlign: 'center',
                      border: '1px solid #e0e0e0',
                      borderRadius: '4px',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: '#01579b',
                        boxShadow: '0px 0px 24px 0px rgba(0, 0, 0, 0.25)',
                      },
                    }}
                  >
                    <Typography variant="h3" sx={{ mb: 1 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#01579b' }}>
                      {stat.label}
                    </Typography>
                  </Paper>
                </Box>
              ))}
            </Box>

            {/* Personal Information Section */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              <Typography variant="h3" sx={{ padding: '8px 0px' }}>
                {t('userDashboard.personalInformation')}
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    padding: '8px 0px',
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ textDecoration: 'underline' }}
                    >
                      {t('userDashboard.nickname')}:
                    </Typography>
                    <Typography variant="body1" color="#757575">
                      {user.nickname}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ textDecoration: 'underline' }}
                    >
                      {t('userDashboard.name')}:
                    </Typography>
                    <Typography variant="body1" color="#757575">
                      {user.name}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ textDecoration: 'underline' }}
                    >
                      {t('userDashboard.surname')}:
                    </Typography>
                    <Typography variant="body1" color="#757575">
                      {user.surname}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, padding: '8px 0px' }}>
                  <Typography
                    variant="body1"
                    sx={{ textDecoration: 'underline' }}
                  >
                    {t('userDashboard.dateOfBirth')}:
                  </Typography>
                  <Typography variant="body1" color="#757575">
                    {user.birthdayDate}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, padding: '8px 0px' }}>
                  <Typography
                    variant="body1"
                    sx={{ textDecoration: 'underline' }}
                  >
                    {t('userDashboard.email')}:
                  </Typography>
                  <Typography variant="body1" color="#757575">
                    {user.email}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, padding: '8px 0px' }}>
                  <Typography
                    variant="body1"
                    sx={{ textDecoration: 'underline' }}
                  >
                    {t('userDashboard.status')}:
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: user.status ? '#1A8E0B' : '#B80C0C' }}
                  >
                    {user.status
                      ? t('userDashboard.active')
                      : t('userDashboard.blocked')}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Languages Section */}
            <Box>
              <Typography variant="h3" sx={{ padding: '8px 0px' }}>
                {t('userDashboard.languages')}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {languageInfo.map((info, index) => (
                  <Box key={index} sx={{ width: { xs: '100%', sm: '50%' } }}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Typography
                        sx={{
                          fontFamily: 'Oswald',
                          textDecoration: 'underline',
                        }}
                      >
                        {info.label}:
                      </Typography>
                      <Typography
                        sx={{ fontFamily: 'Oswald', color: '#757575' }}
                      >
                        {info.value}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box
              sx={{ display: 'flex', justifyContent: 'center', gap: 2, p: 2 }}
            >
              <Button
                variant="contained"
                sx={{
                  bgcolor: '#01579b',
                  padding: '10px 24px',
                  borderRadius: '10px',
                  fontSize: '16px',
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#014374' },
                }}
              >
                {t('userDashboard.block')}
              </Button>
              <Button
                variant="contained"
                color="error"
                sx={{
                  bgcolor: '#b70b0b',
                  padding: '10px 24px',
                  borderRadius: '10px',
                  fontSize: '16px',
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#8f0909' },
                }}
              >
                {t('userDashboard.delete')}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default UserDashboard
