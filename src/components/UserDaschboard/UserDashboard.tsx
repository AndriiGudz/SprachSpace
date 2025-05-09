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
import {
  UserSliceState,
  LanguageData,
} from '../../store/redux/userSlice/types'

// Демо‑пользователь
const demoUser: UserSliceState = {
  id: 123,
  nickname: 'CoolUser',
  name: 'John',
  surname: 'Doe',
  email: 'john.doe@example.com',
  birthdayDate: '1990-01-01',
  foto: 'https://example.com/avatar.png',
  nativeLanguages: [
    { id: 1, skillLevel: 'Native', language: { id: 1, name: 'English' } },
    { id: 4, skillLevel: 'Native', language: { id: 4, name: 'Ukrainish' } },
  ],
  learningLanguages: [
    { id: 2, skillLevel: 'Beginner', language: { id: 2, name: 'German' } },
    { id: 3, skillLevel: 'Intermediate', language: { id: 3, name: 'Russian' } },
  ],
  roles: [
    {
      id: 1,
      title: 'ROLE_USER',
      authority: '',
    },
  ],
  rating: 4.8,
  internalCurrency: 150,
  status: true,
  createdRooms: [],
  accessToken: 'ACCESS_TOKEN_EXAMPLE',
  refreshToken: 'REFRESH_TOKEN_EXAMPLE',
  isAuthenticated: true,
  message: null,
}

function UserDashboard() {
  // Статистика пользователя
  const userStats = [
    { label: 'Points', value: demoUser.internalCurrency },
    { label: 'Reviews', value: '10' },
    { label: 'Room Created', value: demoUser.createdRooms.length.toString() },
    { label: 'Room Attended', value: '5' },
    { label: 'Rating', value: demoUser.rating },
  ]

  // Информация о языках
  const languageInfo = [
    {
      label: 'Native Languages',
      value: demoUser.nativeLanguages
        .map((l: LanguageData) => l.language.name)
        .join(', '),
    },
    {
      label: 'Learning Languages',
      value: demoUser.learningLanguages
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
                src={demoUser.foto || ''}
                alt={`${demoUser.nickname} avatar`}
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
                Personal Information
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
                      Nickname:
                    </Typography>
                    <Typography variant="body1" color="#757575">
                      {demoUser.nickname}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ textDecoration: 'underline' }}
                    >
                      Name:
                    </Typography>
                    <Typography variant="body1" color="#757575">
                      {demoUser.name}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ textDecoration: 'underline' }}
                    >
                      Surname:
                    </Typography>
                    <Typography variant="body1" color="#757575">
                      {demoUser.surname}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, padding: '8px 0px' }}>
                  <Typography
                    variant="body1"
                    sx={{ textDecoration: 'underline' }}
                  >
                    Date of birth:
                  </Typography>
                  <Typography variant="body1" color="#757575">
                    {demoUser.birthdayDate}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, padding: '8px 0px' }}>
                  <Typography
                    variant="body1"
                    sx={{ textDecoration: 'underline' }}
                  >
                    Email:
                  </Typography>
                  <Typography variant="body1" color="#757575">
                    {demoUser.email}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, padding: '8px 0px' }}>
                  <Typography
                    variant="body1"
                    sx={{ textDecoration: 'underline' }}
                  >
                    Status:
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: demoUser.status ? '#1A8E0B' : '#B80C0C' }}
                  >
                    {demoUser.status ? 'Active' : 'Blocked'}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Languages Section */}
            <Box>
              <Typography variant="h3" sx={{ padding: '8px 0px' }}>
                Languages
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
                Block
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
                Delete
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default UserDashboard
