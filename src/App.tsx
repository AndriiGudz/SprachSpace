import { Suspense, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import './i18n'
import GlobalStyles from './styles/GlobalStyles'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Home from './pages/Home/Home'

function App() {
  const { t, i18n } = useTranslation()

  const theme = createTheme({
    typography: {
      fontFamily: 'Oswald, sans-serif',
      allVariants: {
        fontStyle: 'normal',
        fontWeight: 400,
        lineHeight: '100%',
        letterSpacing: '0.32px',
      },
    },
    palette: {
      text: {
        primary: '#212121',
        secondary: '#757575',
      },
    },
  })

  useEffect(() => {
    document.title = t('app.title')
    const descriptionMetaTag = document.querySelector(
      'meta[name="description"]'
    )
    if (descriptionMetaTag) {
      descriptionMetaTag.setAttribute('content', t('app.description'))
    }

    document.documentElement.setAttribute('lang', i18n.language)

    i18n.on('languageChanged', (lng) => {
      document.title = t('app.title')
      if (descriptionMetaTag) {
        descriptionMetaTag.setAttribute('content', t('app.description'))
      }
      document.documentElement.setAttribute('lang', lng)
    })

    return () => {
      i18n.off('languageChanged')
    }
  }, [t, i18n])

  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <GlobalStyles />
          <Layout />
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </ThemeProvider>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
