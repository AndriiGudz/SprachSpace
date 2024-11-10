import { useTranslation } from 'react-i18next';
import {
  DividerStyled,
  MenuItemStyled,
  MobLangSel,
  MobOnly,
  UserInfo,
  UserMenuContainer,
  UserNav,
} from './styles';
import './icon.css';
import { ReactComponent as ProfileIcon } from '../../assets/icon/PersonFilled.svg';
import { ReactComponent as NotificationsIcon } from '../../assets/icon/IoNotifications.svg';
import { ReactComponent as CalendarIcon } from '../../assets/icon/BiCalendar.svg';
import { ReactComponent as FriendsIcon } from '../../assets/icon/GiThreeFriends.svg';
import { ReactComponent as ReviewsIcon } from '../../assets/icon/MdReviews.svg';
import { ReactComponent as SignIn } from '../../assets/icon/MdLogin.svg';
import { ReactComponent as SignoutIcon } from '../../assets/icon/LogoutFilled.svg';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '../../store/redux/userSlice/userSlice';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store/store';
import { toast } from 'react-toastify';

function UserMenu() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );
  const user = useSelector((state: RootState) => state.user);

  const handleSignInClick = () => {
    navigate('/signin');
  };

  const handleLogout = () => {
    dispatch(clearUser());
    localStorage.removeItem('user');
    navigate('/');
    toast.success(t('userMenu.logoutSuccess'));
  };

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
        <MenuItemStyled>{t('userMenu.meetings')}</MenuItemStyled>
        <MenuItemStyled>{t('userMenu.about')}</MenuItemStyled>
        {isAuthenticated && <DividerStyled />}
      </MobOnly>
      {isAuthenticated && (
        <UserNav>
          <MenuItemStyled>
            <ProfileIcon className="icon" /> {t('userMenu.profile')}
          </MenuItemStyled>
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
  );
}

export default UserMenu;
