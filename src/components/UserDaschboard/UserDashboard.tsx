import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
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
import { RootState } from '../../store/store'
import { API_ROOT_URL } from '../../config/apiConfig'

interface UserDashboardProps {
  userId: string | undefined
}

function UserDashboard({ userId }: UserDashboardProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const adminId = useSelector((state: RootState) => state.user.id)
  const [user, setUser] = useState<UserSliceState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

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

  const srcAvatarUrl = useMemo(
    () =>
      user?.avatar ? `${API_ROOT_URL}/users/file/avatar/${user.avatar}` : null,
    [user?.avatar]
  )

  const handleBlock = async () => {
    if (!user || isProcessing || !userId || !adminId) return
    setIsProcessing(true)

    try {
      const endpoint = user.status
        ? `http://localhost:8080/api/users/block?admin=${adminId}&user=${userId}`
        : `http://localhost:8080/api/users/unlock?admin=${adminId}&user=${userId}`

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(
          user.status ? 'Failed to block user' : 'Failed to unblock user'
        )
      }

      setUser((prev) => (prev ? { ...prev, status: !prev.status } : null))
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDelete = async () => {
    if (!user || isProcessing || !userId) return
    setIsProcessing(true)

    try {
      const response = await fetch(
        `http://localhost:8080/api/users/delete?id=${userId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to delete user')
      }

      // После успешного удаления перенаправляем на список пользователей используя React Router
      navigate('/admin/users')
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSetAdmin = async () => {
    if (!user || isProcessing || !userId || !adminId) return
    setIsProcessing(true)

    try {
      const response = await fetch(
        `http://localhost:8080/api/users/setAdmin?admin=${adminId}&user=${userId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to set user as admin')
      }

      // Получаем обновленные данные пользователя
      const updatedUser = await response.json()
      setUser(updatedUser)
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsProcessing(false)
    }
  }

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
                src={srcAvatarUrl || ''}
                alt={`${user.nickname} avatar`}
                sx={{ width: 100, height: 100 }}
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
                onClick={handleSetAdmin}
                disabled={
                  isProcessing ||
                  user?.roles.some(
                    (role) =>
                      typeof role === 'object' && role.title === 'ROLE_ADMIN'
                  )
                }
                sx={{
                  bgcolor: '#0288d1',
                  padding: '10px 24px',
                  borderRadius: '10px',
                  fontSize: '16px',
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#01579b' },
                  '&:disabled': { bgcolor: '#757575' },
                }}
              >
                {isProcessing
                  ? t('userDashboard.processing')
                  : t('userDashboard.setAdmin')}
              </Button>
              <Button
                variant="contained"
                onClick={handleBlock}
                disabled={isProcessing}
                sx={{
                  bgcolor: !user?.status ? '#2e7d32' : '#ed6c02',
                  padding: '10px 24px',
                  borderRadius: '10px',
                  fontSize: '16px',
                  textTransform: 'none',
                  '&:hover': { bgcolor: !user?.status ? '#1b5e20' : '#c65102' },
                  '&:disabled': { bgcolor: '#757575' },
                }}
              >
                {isProcessing
                  ? t('userDashboard.processing')
                  : !user?.status
                  ? t('userDashboard.unblock')
                  : t('userDashboard.block')}
              </Button>
              <Button
                variant="contained"
                onClick={handleDelete}
                disabled={isProcessing}
                sx={{
                  bgcolor: '#d32f2f',
                  padding: '10px 24px',
                  borderRadius: '10px',
                  fontSize: '16px',
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#9a0007' },
                  '&:disabled': { bgcolor: '#757575' },
                }}
              >
                {isProcessing
                  ? t('userDashboard.processing')
                  : t('userDashboard.delete')}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default UserDashboard
