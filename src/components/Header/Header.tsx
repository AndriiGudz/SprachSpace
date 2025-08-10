import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAvatarLoader } from '../../hooks/useAvatarLoader'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import MenuIcon from '@mui/icons-material/Menu'
import { Avatar, Badge } from '@mui/material'
import { useSelector } from 'react-redux'
import { selectUnreadCount } from '../../store/redux/notificationSlice/selectors'
import { ReactComponent as Logo } from '../../assets/Logo-sprachspace.svg'
import {
  HeaderBox,
  LogoContainer,
  DesktopOnly,
  UserMenuWrapper,
  AvatarContainer,
  MobileAvatar,
  MenuButton,
  LanguageSelectorContainer,
} from './styles'
import NavLinks from '../NavLinks/NavLinks'
import ButtonSign from '../ButtonSign/ButtonSign'
import UserMenu from '../UserMenu/UserMenu'
import LanguageSelector from '../LanguageSelector/LanguageSelector'

function Header() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { avatarUrl, isAuthenticated } = useAvatarLoader()
  const menuRef = useRef<HTMLDivElement | null>(null)
  const unreadCount = useSelector(selectUnreadCount)

  const handleSignInClick = () => {
    navigate('/signin')
  }

  const toggleUserMenu = () => {
    setIsMenuOpen((prev) => !prev)
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

  useEffect(() => {
    if (!isAuthenticated) {
      setIsMenuOpen(false)
    }
  }, [isAuthenticated])

  const handleMenuItemClick = () => {
    setIsMenuOpen(false)
  }

  // Рендер аватара с fallback логикой и Badge для уведомлений
  const renderAvatar = () => {
    const avatarComponent = avatarUrl ? (
      <Avatar
        src={avatarUrl}
        alt="User Avatar"
        sx={{
          width: 36,
          height: 36,
          marginLeft: '16px',
          '& .MuiAvatar-img': {
            marginRight: '0 !important',
          },
        }}
      />
    ) : (
      <AccountCircleIcon
        sx={{
          color: '#ffffff',
          backgroundColor: '#01579b',
          borderRadius: '50%',
          width: 36,
          height: 36,
          marginLeft: '16px',
          cursor: 'pointer',
        }}
      />
    )

    // Если есть непрочитанные уведомления, оборачиваем в Badge
    if (isAuthenticated && unreadCount > 0) {
      return (
        <Badge
          badgeContent={unreadCount}
          color="error"
          max={99}
          sx={{
            '& .MuiBadge-badge': {
              fontSize: '0.75rem',
              minWidth: '18px',
              height: '18px',
              top: '6px',
              right: '6px',
            },
          }}
        >
          {avatarComponent}
        </Badge>
      )
    }

    return avatarComponent
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
              {renderAvatar()}
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
        <LanguageSelectorContainer>
          <LanguageSelector />
        </LanguageSelectorContainer>
      </DesktopOnly>
      {/* Мобильная версия */}
      {isAuthenticated ? (
        <>
          <MobileAvatar onClick={toggleUserMenu}>{renderAvatar()}</MobileAvatar>
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
