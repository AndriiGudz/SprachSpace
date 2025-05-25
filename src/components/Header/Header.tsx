import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect, useRef } from 'react'
import { ReactComponent as Logo } from '../../assets/Logo-sprachspace.svg'
import MenuIcon from '@mui/icons-material/Menu'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { Avatar } from '@mui/material'
import ButtonSign from '../ButtonSign/ButtonSign'
import LanguageSelector from '../LanguageSelector/LanguageSelector'
import UserMenu from '../UserMenu/UserMenu'
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
import { RootState } from '../../store/store'
import { getAvatarUrl } from '../../api/userApi'
import { setAvatarDisplayUrl } from '../../store/redux/userSlice/userSlice'

function Header() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const user = useSelector((state: RootState) => state.user)
  const isAuthenticated = user.isAuthenticated
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let currentObjectURL: string | undefined

    async function fetchAndSetAvatar() {
      if (user.id && user.foto && user.accessToken) {
        try {
          const url = await getAvatarUrl(user.id, user.accessToken)
          if (url) {
            currentObjectURL = url
            dispatch(setAvatarDisplayUrl(url))
          } else {
            dispatch(setAvatarDisplayUrl(null))
          }
        } catch (error) {
          console.error('Failed to fetch avatar:', error)
          dispatch(setAvatarDisplayUrl(null))
        }
      } else if (!user.foto) {
        dispatch(setAvatarDisplayUrl(null))
      }
    }

    if (isAuthenticated) {
      fetchAndSetAvatar()
    }

    return () => {
      if (currentObjectURL && currentObjectURL.startsWith('blob:')) {
        // URL.revokeObjectURL(currentObjectURL);
      }
    }
  }, [user.id, user.foto, user.accessToken, isAuthenticated, dispatch])

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
              {user.avatarDisplayUrl ? (
                <Avatar
                  src={user.avatarDisplayUrl}
                  alt="User Avatar"
                  sx={{ width: 36, height: 36, marginLeft: '16px' }}
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
              )}
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
            {user.avatarDisplayUrl ? (
              <Avatar
                src={user.avatarDisplayUrl}
                alt="User Avatar"
                sx={{ width: 36, height: 36 }}
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
            )}
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
