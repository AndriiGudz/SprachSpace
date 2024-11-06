import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ReactComponent as Logo } from '../../assets/Logo-sprachspace.svg'
import MenuIcon from '@mui/icons-material/Menu'
import ButtonSign from '../ButtonSign/ButtonSign'
import LanguageSelector from '../LanguageSelector/LanguageSelector'
import {
  HeaderBox,
  LogoContainer,
  MenuButton,
  DesktopOnly,
  AvatarContainer,
  MobileAvatar,
} from './styles'
import NavLinks from '../NavLinks/NavLinks'
import defaultAvatar from '../../assets/default-avatar.png' // Иконка по умолчанию

function Header() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const user = useSelector((state: any) => state.auth.user) // Извлекаем информацию о пользователе
  const isAuthenticated = useSelector(
    (state: any) => state.auth.isAuthenticated
  )

  const handleSignInClick = () => {
    navigate('/signin')
  }

  return (
    <HeaderBox>
      <LogoContainer href="/">
        <Logo />
      </LogoContainer>
      <DesktopOnly>
        <NavLinks />
        {isAuthenticated ? (
          <AvatarContainer>
            <img
              src={user?.avatar || defaultAvatar}
              alt="User Avatar"
              width="36"
              height="36"
            />
          </AvatarContainer>
        ) : (
          <ButtonSign
            text={t('header.signIn')}
            onClick={handleSignInClick}
            variant="light"
            type="button"
          />
        )}
        <LanguageSelector />
      </DesktopOnly>
      {isAuthenticated ? (
        <MobileAvatar>
          <img
            src={user?.avatar || defaultAvatar}
            alt="User Avatar"
            width="36"
            height="36"
          />
        </MobileAvatar>
      ) : (
        <MenuButton>
          <MenuIcon fontSize="large" />
        </MenuButton>
      )}
    </HeaderBox>
  )
}

export default Header
