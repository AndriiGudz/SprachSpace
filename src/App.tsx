import { Suspense, useEffect } from 'react'
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
import { Provider, useDispatch } from 'react-redux'
import { store } from './store/store'
import Notifications from './components/Notifications/Notifications'
import { setTokens, setUser } from './store/redux/userSlice/userSlice'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
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
  }, [dispatch])

  const { t, i18n } = useTranslation()

  useEffect(() => {
    // Логика с title и описанием
  }, [t, i18n])

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Notifications />
          <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <CssBaseline />
              <GlobalStyles />
              <Routes>
                <Route path="/signin" element={<PageSignInUp />} />
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  {/* Защищенный маршрут для /profile и др.*/}
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
        </Suspense>
      </BrowserRouter>
    </Provider>
  )
}

export default App
