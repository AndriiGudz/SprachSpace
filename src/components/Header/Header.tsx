import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ReactComponent as Logo } from '../../assets/Logo-sprachspace.svg'
import ButtonSignBl from '../ButtonSignBl/ButtonSignBl'
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
      <ButtonSignBl text={t('header.signIn')} onClick={handleSignInClick} />
      <LanguageSelector />
    </HeaderBox>
  )
}

export default Header
