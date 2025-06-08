import { useTranslation } from 'react-i18next'
import { BannerContent, ContentBox } from './styles'
import { useNavigate } from 'react-router-dom'
import ButtonMUI from '../ButtonMUI/ButtonMUI'
import { useLazyBackgroundAdvanced } from '../../hooks/useLazyBackgroundAdvanced'
import bannerImageWebP from '../../assets/new-banner2.webp'
import { Box } from '@mui/material'

function HomepageBanner() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  // Используем WebP изображение с ленивой загрузкой
  const { ref, isLoaded, hasError, backgroundStyle } =
    useLazyBackgroundAdvanced({
      sources: bannerImageWebP,
      threshold: 0.1,
      rootMargin: '100px',
      preloadPriority: 'high',
    })

  const handleSignInClick = () => {
    navigate('/signin')
  }

  return (
    <Box
      ref={ref}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        height: '700px',
        position: 'relative',
        ...backgroundStyle,
      }}
    >
      {/* Fallback при ошибке */}
      {hasError && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
          }}
        >
          <p>Изображение не загрузилось</p>
        </Box>
      )}

      <ContentBox>
        <Box
          sx={{
            opacity: isLoaded ? 1 : 0.8,
            transition: 'opacity 0.3s ease-in-out',
          }}
        >
        <BannerContent>
          <h1>{t('headerBanner.title')}</h1>
          <p>{t('headerBanner.description')}</p>
          <ButtonMUI
            text={t('headerBanner.join')}
            onClick={handleSignInClick}
          />
        </BannerContent>
        </Box>
      </ContentBox>
    </Box>
  )
}

export default HomepageBanner
