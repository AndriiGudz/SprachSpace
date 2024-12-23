import { useTranslation } from 'react-i18next'
import { BannerBox, BannerContent, ContentBox } from './styles'
import { useNavigate } from 'react-router-dom'
import ButtonMUI from '../ButtonMUI/ButtonMUI'

function HomepageBanner() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleSignInClick = () => {
    navigate('/signin')
  }
  return (
    <BannerBox>
      <ContentBox>
        <BannerContent>
          <h1>
            {t('headerBanner.title')}
          </h1>
          <p>
            {t('headerBanner.description')}
          </p>
          <ButtonMUI
            text={t('headerBanner.join')}
            onClick={handleSignInClick}
          />
        </BannerContent>
      </ContentBox>
    </BannerBox>
  )
}

export default HomepageBanner
