import { useTranslation } from 'react-i18next'
import { Badge } from '@mui/material'
import {
  DividerStyled,
  LinkStyle,
  MenuItemStyled,
  MobLangSel,
  MobOnly,
  UserInfo,
  UserMenuContainer,
  UserNav,
  NotificationBadge,
  AdminBadge,
  LogoutButton,
  SignInButton,
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
import { selectUnreadCount } from '../../store/redux/notificationSlice/selectors'

interface UserMenuProps {
  onMenuItemClick: () => void
}

interface MenuItemProps {
  to?: string
  icon: React.ReactNode
  label: string
  onClick?: () => void
  badge?: number
  isAdmin?: boolean
}

function MenuItem({ to, icon, label, onClick, badge, isAdmin }: MenuItemProps) {
  const handleClick = () => {
    onClick?.()
  }

  const content = (
    <MenuItemStyled onClick={handleClick}>
      <div
        style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
      >
        {badge !== undefined && badge > 0 ? (
          <NotificationBadge>
            <Badge badgeContent={badge} color="error" max={99}>
              {icon}
            </Badge>
          </NotificationBadge>
        ) : (
          icon
        )}
        {isAdmin && <AdminBadge />}
      </div>
      {label}
    </MenuItemStyled>
  )

  return to ? (
    <LinkStyle to={to} onClick={onClick}>
      {content}
    </LinkStyle>
  ) : (
    content
  )
}

function UserMenu({ onMenuItemClick }: UserMenuProps) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  )
  const user = useSelector((state: RootState) => state.user)
  const unreadCount = useSelector(selectUnreadCount)

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
        <MenuItem
          icon={<CalendarIcon className="icon" />}
          label={t('userMenu.meetings')}
          onClick={onMenuItemClick}
        />
        <MenuItem
          icon={<ProfileIcon className="icon" />}
          label={t('userMenu.about')}
          onClick={onMenuItemClick}
        />
        {isAuthenticated && <DividerStyled />}
      </MobOnly>

      {isAuthenticated && (
        <UserNav>
          <MenuItem
            to="/profile"
            icon={<ProfileIcon className="icon" />}
            label={t('userMenu.profile')}
            onClick={onMenuItemClick}
          />

          {isAdmin && (
            <MenuItem
              to="/admin/users"
              icon={<AdminIcon className="icon admin-icon" />}
              label={t('userMenu.userList')}
              onClick={onMenuItemClick}
              isAdmin={true}
            />
          )}

          <MenuItem
            to="/notifications"
            icon={<NotificationsIcon className="icon notifications-icon" />}
            label={t('userMenu.notifications')}
            onClick={onMenuItemClick}
            badge={unreadCount}
          />

          <MenuItem
            to="/scheduled-meetings"
            icon={<CalendarIcon className="icon calendar-icon" />}
            label={t('userMenu.scheduledMeetings')}
            onClick={onMenuItemClick}
          />

          <MenuItem
            icon={<FriendsIcon className="icon friends-icon" />}
            label={t('userMenu.friends')}
            onClick={onMenuItemClick}
          />

          <MenuItem
            icon={<ReviewsIcon className="icon reviews-icon" />}
            label={t('userMenu.reviews')}
            onClick={onMenuItemClick}
          />
        </UserNav>
      )}

      <MobLangSel>
        <DividerStyled />
        <LanguageSelector />
      </MobLangSel>

      <DividerStyled />

      {isAuthenticated ? (
        <LogoutButton onClick={handleLogout}>
          <SignoutIcon className="icon" /> {t('userMenu.signOut')}
        </LogoutButton>
      ) : (
        <SignInButton onClick={handleSignInClick}>
          <SignIn className="icon" /> {t('userMenu.signIn')}
        </SignInButton>
      )}
    </UserMenuContainer>
  )
}

export default UserMenu
