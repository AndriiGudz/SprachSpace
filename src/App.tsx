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

function App() {
  const dispatch = useDispatch()
  const { t, i18n } = useTranslation()
  const [isLoading, setIsLoading] = useState(true)

  // Используем один useEffect для инициализации состояния загрузки и загрузки данных пользователя
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 4500)

    // Загрузка данных пользователя из localStorage при инициализации приложения
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      dispatch(setUser(userData))
      dispatch(
        setTokens({
          accessToken: userData.accessToken,
          refreshToken: userData.refreshToken,
        })
      )
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
