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
    <Box
      sx={{
        // Учитываем фиксированный хедер - добавляем отступ сверху
        pt: { xs: '24px', md: '42px' },
        pb: { xs: 3, md: 4 },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          px: { xs: 2, sm: 3, md: 4 }, // Адаптивные отступы по бокам
          maxWidth: { lg: '1200px' },
          width: '100%', // Убираем фиксированную ширину для мобильных
        }}
      >
        <Card
          sx={{
            borderRadius: '12px',
            boxShadow: '0px 4px 20px 0px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            {/* Avatar Section */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mb: { xs: 2, md: 3 },
              }}
            >
              <Avatar
                src={srcAvatarUrl || ''}
                alt={`${user.nickname} avatar`}
                sx={{
                  width: { xs: 80, sm: 100 },
                  height: { xs: 80, sm: 100 },
                }}
              />
            </Box>

            {/* Stats Section */}
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: { xs: 1, sm: 2 },
                mb: { xs: 3, md: 4 },
                '& > *': {
                  flex: {
                    xs: '0 0 calc(50% - 4px)', // 2 колонки на мобильных с учетом gap
                    sm: '0 0 calc(33.333% - 8px)', // 3 колонки на планшетах
                    md: '1 1 0', // На десктопе равномерно распределяем все элементы
                  },
                  maxWidth: {
                    xs: 'calc(50% - 4px)',
                    sm: 'calc(33.333% - 8px)',
                    md: 'none', // Убираем ограничение ширины на десктопе
                  },
                },
              }}
            >
              {userStats.map((stat, index) => (
                <Paper
                  key={index}
                  elevation={0}
                  sx={{
                    minWidth: '150px',
                    padding: {
                      xs: '12px 8px',
                      sm: '16px 12px',
                      md: '16px 20px',
                    },
                    textAlign: 'center',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#01579b',
                      boxShadow: '0px 4px 12px 0px rgba(1, 87, 155, 0.15)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      mb: 0.5,
                      fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                      fontWeight: 'bold',
                      color: '#01579b',
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#666',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      lineHeight: 1.2,
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Paper>
              ))}
            </Box>

            {/* Personal Information Section */}
            <Box sx={{ mb: { xs: 3, md: 4 } }}>
              <Typography
                variant="h4"
                sx={{
                  mb: { xs: 2, md: 3 },
                  fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' },
                  fontWeight: 'bold',
                  color: '#333',
                }}
              >
                {t('userDashboard.personalInformation')}
              </Typography>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                  gap: { xs: 1.5, sm: 2 },
                  '& > div': {
                    p: { xs: 1.5, sm: 2 },
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef',
                  },
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 'bold',
                      color: '#01579b',
                      mb: 0.5,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    }}
                  >
                    {t('userDashboard.nickname')}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#333',
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                    }}
                  >
                    {user.nickname}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 'bold',
                      color: '#01579b',
                      mb: 0.5,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    }}
                  >
                    {t('userDashboard.name')}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#333',
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                    }}
                  >
                    {user.name}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 'bold',
                      color: '#01579b',
                      mb: 0.5,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    }}
                  >
                    {t('userDashboard.surname')}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#333',
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                    }}
                  >
                    {user.surname}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 'bold',
                      color: '#01579b',
                      mb: 0.5,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    }}
                  >
                    {t('userDashboard.dateOfBirth')}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#333',
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                    }}
                  >
                    {user.birthdayDate}
                  </Typography>
                </Box>

                <Box sx={{ gridColumn: { xs: '1', sm: 'span 2' } }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 'bold',
                      color: '#01579b',
                      mb: 0.5,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    }}
                  >
                    {t('userDashboard.email')}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#333',
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      wordBreak: 'break-all',
                    }}
                  >
                    {user.email}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 'bold',
                      color: '#01579b',
                      mb: 0.5,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    }}
                  >
                    {t('userDashboard.status')}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: user.status ? '#1A8E0B' : '#B80C0C',
                      fontWeight: 'bold',
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                    }}
                  >
                    {user.status
                      ? t('userDashboard.active')
                      : t('userDashboard.blocked')}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Languages Section */}
            <Box sx={{ mb: { xs: 3, md: 4 } }}>
              <Typography
                variant="h4"
                sx={{
                  mb: { xs: 2, md: 3 },
                  fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' },
                  fontWeight: 'bold',
                  color: '#333',
                }}
              >
                {t('userDashboard.languages')}
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                  gap: { xs: 1.5, sm: 2 },
                  '& > div': {
                    p: { xs: 1.5, sm: 2 },
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef',
                  },
                }}
              >
                {languageInfo.map((info, index) => (
                  <Box key={index}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 'bold',
                        color: '#01579b',
                        mb: 0.5,
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      }}
                    >
                      {info.label}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#333',
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                      }}
                    >
                      {info.value || 'Не указано'}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'center',
                gap: { xs: 1.5, sm: 2 },
                mt: { xs: 2, md: 3 },
              }}
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
                  padding: { xs: '12px 20px', sm: '10px 24px' },
                  borderRadius: '10px',
                  fontSize: { xs: '14px', sm: '16px' },
                  textTransform: 'none',
                  minHeight: '48px', // Для лучшего touch target
                  '&:hover': { bgcolor: '#01579b' },
                  '&:disabled': { bgcolor: '#757575' },
                }}
                fullWidth={false}
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
                  padding: { xs: '12px 20px', sm: '10px 24px' },
                  borderRadius: '10px',
                  fontSize: { xs: '14px', sm: '16px' },
                  textTransform: 'none',
                  minHeight: '48px',
                  '&:hover': { bgcolor: !user?.status ? '#1b5e20' : '#c65102' },
                  '&:disabled': { bgcolor: '#757575' },
                }}
                fullWidth={false}
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
                  padding: { xs: '12px 20px', sm: '10px 24px' },
                  borderRadius: '10px',
                  fontSize: { xs: '14px', sm: '16px' },
                  textTransform: 'none',
                  minHeight: '48px',
                  '&:hover': { bgcolor: '#9a0007' },
                  '&:disabled': { bgcolor: '#757575' },
                }}
                fullWidth={false}
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
