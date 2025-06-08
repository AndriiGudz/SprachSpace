import { useTranslation } from 'react-i18next'
import {
  DividerStyled,
  LinkStyle,
  MenuItemStyled,
  MobLangSel,
  MobOnly,
  UserInfo,
  UserMenuContainer,
  UserNav,
} from './styles'
import './icon.css'
import { ReactComponent as ProfileIcon } from '../../assets/icon/PersonFilled.svg'
import { ReactComponent as NotificationsIcon } from '../../assets/icon/IoNotifications.svg'
import { ReactComponent as CalendarIcon } from '../../assets/icon/BiCalendar.svg'
import { ReactComponent as FriendsIcon } from '../../assets/icon/GiThreeFriends.svg'
import { ReactComponent as ReviewsIcon } from '../../assets/icon/MdReviews.svg'
import { ReactComponent as SignIn } from '../../assets/icon/MdLogin.svg'
import { ReactComponent as SignoutIcon } from '../../assets/icon/LogoutFilled.svg'
import { ReactComponent as AdminIcon } from '../../assets/icon/AdminIcon.svg'
import LanguageSelector from '../LanguageSelector/LanguageSelector'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../../store/redux/userSlice/userSlice'
import { clearAllUserParticipations } from '../../store/redux/roomSlice/roomSlice'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../../store/store'
import { toast } from 'react-toastify'

interface UserMenuProps {
  onMenuItemClick: () => void
}

function UserMenu({ onMenuItemClick }: UserMenuProps) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  )
  const user = useSelector((state: RootState) => state.user)

  // Проверяем, есть ли у пользователя роль администратора
  const isAdmin = user.roles?.some((role) => role.title === 'ROLE_ADMIN')

  const handleSignInClick = () => {
    onMenuItemClick()
    navigate('/signin')
  }

  const handleLogout = async () => {
    try {
      // Очищаем заявки пользователя
      dispatch(clearAllUserParticipations())

      // Используем logoutUser для полной очистки состояния
      dispatch(logoutUser())

      // Закрываем меню
      onMenuItemClick()

      // Показываем уведомление об успешном выходе
      toast.success(t('userMenu.logoutSuccess'))

      // Редиректим на главную с заменой записи в истории
      navigate('/', { replace: true })
    } catch (error) {
      console.error('Logout error:', error)
      toast.error(t('userMenu.logoutError'))
    }
  }

  return (
    <UserMenuContainer>
      {isAuthenticated && (
        <>
          <UserInfo>
            <span>
              {user.name} {user.surname}
            </span>
            <p>{user.email}</p>
          </UserInfo>
          <DividerStyled />
        </>
      )}
      <MobOnly>
        <MenuItemStyled onClick={onMenuItemClick}>
          {t('userMenu.meetings')}
        </MenuItemStyled>
        <MenuItemStyled onClick={onMenuItemClick}>
          {t('userMenu.about')}
        </MenuItemStyled>
        {isAuthenticated && <DividerStyled />}
      </MobOnly>
      {isAuthenticated && (
        <UserNav>
          <LinkStyle to="/profile" onClick={onMenuItemClick}>
            <MenuItemStyled>
              <ProfileIcon className="icon" /> {t('userMenu.profile')}
            </MenuItemStyled>
          </LinkStyle>
          {/* Добавляем ссылку на страницу администрирования, видимую только для админов */}
          {isAdmin && (
            <LinkStyle to="/admin/users" onClick={onMenuItemClick}>
              <MenuItemStyled>
                <AdminIcon className="icon" /> {t('userMenu.userList')}
              </MenuItemStyled>
            </LinkStyle>
          )}
          <MenuItemStyled>
            <NotificationsIcon className="icon" /> {t('userMenu.notifications')}
          </MenuItemStyled>
          <MenuItemStyled>
            <CalendarIcon className="icon" /> {t('userMenu.scheduledMeetings')}
          </MenuItemStyled>
          <MenuItemStyled>
            <FriendsIcon className="icon" /> {t('userMenu.friends')}
          </MenuItemStyled>
          <MenuItemStyled>
            <ReviewsIcon className="icon" /> {t('userMenu.reviews')}
          </MenuItemStyled>
        </UserNav>
      )}
      <MobLangSel>
        <DividerStyled />
        <LanguageSelector />
      </MobLangSel>
      <DividerStyled />
      {isAuthenticated ? (
        <MenuItemStyled onClick={handleLogout}>
          <SignoutIcon className="icon" /> {t('userMenu.signOut')}
        </MenuItemStyled>
      ) : (
        <MenuItemStyled onClick={handleSignInClick}>
          <SignIn className="icon" /> {t('userMenu.signIn')}
        </MenuItemStyled>
      )}
    </UserMenuContainer>
  )
}

export default UserMenu
