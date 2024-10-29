import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ReactComponent as Logo } from '../../assets/Logo-sprachspace.svg'
import ButtonSign from '../ButtonSign/ButtonSign'
import LanguageSelector from '../LanguageSelector/LanguageSelector'
import { HeaderBox } from './styles'
import NavLinks from '../NavLinks/NavLinks'

function Header() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleSignInClick = () => {
    navigate('/signin')
  }

  return (
    <HeaderBox>
      <a href="/">
        <Logo width="252" height="70" />
      </a>
      <NavLinks />
      <ButtonSign text={t('header.signIn')} onClick={handleSignInClick} variant='light' />
      <LanguageSelector />
    </HeaderBox>
  )
}

export default Header
