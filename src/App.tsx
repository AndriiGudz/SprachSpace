import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import './i18n'
import GlobalStyles from './styles/GlobalStyles'
import CssBaseline from '@mui/material/CssBaseline'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Home from './pages/Home/Home'
import PageSignInUp from './pages/PageSignInUp/PageSignInUp'
import Profile from './pages/Profile/Profile'
import ProtectedRoute from '../src/components/ProtectedRoute/ProtectedRoute'
import AdminRoute from '../src/components/ProtectedRoute/AdminRoute'
import AuthGuard from './components/AuthGuard/AuthGuard'
import theme from './theme'
import { ThemeProvider } from '@mui/material/styles'
import Notifications from './components/Notifications/Notifications'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import LoadingScreen from './components/LoadingScreen/LoadingScreen'
import Meetings from './pages/Meetings/Meetings'
import Admin from './pages/Admin/PageAdminUsersList'
import UserDaschboard from './pages/Admin/PageUserDaschboard'
import MeetingChat from './pages/MeetingChat/MeetingChat'

function App() {
  const { t, i18n } = useTranslation()
  const [isLoading, setIsLoading] = useState(true)

  // Простая инициализация приложения
  useEffect(() => {
    // Симуляция загрузки (убери, если не нужен)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 4500)

    return () => clearTimeout(timer)
  }, [])

  // Обновление title страницы при изменении языка
  useEffect(() => {
    if (i18n.isInitialized) {
      document.title = t('app.title')
    }
  }, [i18n.isInitialized, t])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <CssBaseline />
          <GlobalStyles />
          <AuthGuard>
            <Notifications />
            <Routes>
              <Route path="/signin" element={<PageSignInUp />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="/meetings" element={<Meetings />} />
                <Route path="/meetings/:meetingId" element={<MeetingChat />} />
                <Route
                  path="/admin/users"
                  element={
                    <AdminRoute>
                      <Admin />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/users/:userId"
                  element={
                    <AdminRoute>
                      <UserDaschboard />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
              </Route>
            </Routes>
          </AuthGuard>
        </LocalizationProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
