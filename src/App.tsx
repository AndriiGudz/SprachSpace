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
import theme from './theme'
import { ThemeProvider } from '@mui/material/styles'
import Notifications from './components/Notifications/Notifications'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useDispatch } from 'react-redux'
import { setTokens, setUser } from './store/redux/userSlice/userSlice'
import LoadingScreen from './components/LoadingScreen/LoadingScreen'
import Meetings from './pages/Meetings/Meetings'
import Admin from './pages/Admin/PageAdminUsersList'

function App() {
  const dispatch = useDispatch()
  const { t, i18n } = useTranslation()
  const [isLoading, setIsLoading] = useState(true)

  // Используем один useEffect для инициализации состояния загрузки и загрузки данных пользователя
  useEffect(() => {
    // Симуляция загрузки (убери, если не нужен)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 4500)

    // Загружаем данные из localStorage
    const storedUser = localStorage.getItem('user')

    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)

        // Проверяем, есть ли в данных токены и пользователь не разлогинен
        if (userData && userData.accessToken) {
          dispatch(setUser(userData))
          dispatch(
            setTokens({
              accessToken: userData.accessToken,
              refreshToken: userData.refreshToken,
            })
          )
        }
      } catch (error) {
        console.error(
          'Ошибка при загрузке пользователя из localStorage:',
          error
        )
      }
    }

    return () => clearTimeout(timer)
  }, [dispatch])

  // Обновление title страницы при изменении языка
  useEffect(() => {
    if (i18n.isInitialized) {
      document.title = t('app.title')
    }
  }, [i18n.isInitialized, t]) // Используем `i18n.isInitialized` и `t` для корректного обновления переводов

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <CssBaseline />
          <GlobalStyles />
          <Notifications />
          <Routes>
            <Route path="/signin" element={<PageSignInUp />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/meetings" element={<Meetings />} />
              <Route path="/admin/users" element={<Admin />} />
              {/* <Route
                path="/admin/users"
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                }
              /> */}
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
        </LocalizationProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
