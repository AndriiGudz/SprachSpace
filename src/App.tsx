import { Suspense, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import './i18n'
import GlobalStyles from './styles/GlobalStyles'
import CssBaseline from '@mui/material/CssBaseline'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Home from './pages/Home/Home'
import PageSignInUp from './pages/PageSignInUp/PageSignInUp'
import theme from './theme' // Импортируем тему
import { ThemeProvider } from '@mui/material/styles'
import { Provider } from 'react-redux'
import { store } from './store/store'

function App() {
  const { t, i18n } = useTranslation()

  useEffect(() => {
    // Логика с title и описанием
  }, [t, i18n])

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <ThemeProvider theme={theme}>
            {' '}
            {/* Применяем тему */}
            <CssBaseline />
            <GlobalStyles />
            <Routes>
              <Route path="/signin" element={<PageSignInUp />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
              </Route>
            </Routes>
          </ThemeProvider>
        </Suspense>
      </BrowserRouter>
    </Provider>
  )
}

export default App
