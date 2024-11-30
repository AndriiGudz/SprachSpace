import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useState, useEffect, useRef } from 'react'
import { ReactComponent as Logo } from '../../assets/Logo-sprachspace.svg'
import MenuIcon from '@mui/icons-material/Menu'
import ButtonSign from '../ButtonSign/ButtonSign'
import LanguageSelector from '../LanguageSelector/LanguageSelector'
import UserMenu from '../UserMenu/UserMenu' // Импорт компонента UserMenu
import {
  HeaderBox,
  LogoContainer,
  MenuButton,
  DesktopOnly,
  AvatarContainer,
  MobileAvatar,
  UserMenuWrapper,
} from './styles'
import NavLinks from '../NavLinks/NavLinks'
import defaultAvatar from '../../assets/default-avatar.png'

function Header() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false) // Состояние для отслеживания видимости UserMenu
  const user = useSelector((state: any) => state.user)
  const isAuthenticated = user.isAuthenticated
  const menuRef = useRef<HTMLDivElement | null>(null)

  const handleSignInClick = () => {
    navigate('/signin')
  }

  const toggleUserMenu = () => {
    setIsMenuOpen((prev) => !prev) // Переключаем состояние меню
  }

  const handleOutsideClick = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsMenuOpen(false)
    }
  }

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick)
    } else {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [isMenuOpen])

  // Закрываем меню при разлогинивании
  useEffect(() => {
    if (!isAuthenticated) {
      setIsMenuOpen(false)
    }
  }, [isAuthenticated])

  // Закрывает меню при нажатии на пункт меню
  const handleMenuItemClick = () => {
    setIsMenuOpen(false)
  }

  return (
    <HeaderBox>
      <LogoContainer onClick={() => navigate('/')}>
        <Logo />
      </LogoContainer>
      <DesktopOnly>
        <NavLinks />
        {isAuthenticated ? (
          <>
            <AvatarContainer onClick={toggleUserMenu}>
              <img
                src={user.avatar || defaultAvatar}
                alt="User Avatar"
                width="36"
                height="36"
              />
            </AvatarContainer>
            {isMenuOpen && (
              <UserMenuWrapper ref={menuRef}>
                <UserMenu onMenuItemClick={handleMenuItemClick} />
              </UserMenuWrapper>
            )}
          </>
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
        <>
          <MobileAvatar onClick={toggleUserMenu}>
            <img
              src={user.avatar || defaultAvatar}
              alt="User Avatar"
              width="36"
              height="36"
            />
          </MobileAvatar>
          {isMenuOpen && (
            <UserMenuWrapper ref={menuRef}>
              <UserMenu onMenuItemClick={handleMenuItemClick} />
            </UserMenuWrapper>
          )}
        </>
      ) : (
        <>
          <MenuButton onClick={toggleUserMenu}>
            <MenuIcon fontSize="large" />
          </MenuButton>
          {isMenuOpen && (
            <UserMenuWrapper ref={menuRef}>
              <UserMenu onMenuItemClick={handleMenuItemClick} />
            </UserMenuWrapper>
          )}
        </>
      )}
    </HeaderBox>
  )
}

export default Header
