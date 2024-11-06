import {
  DividerStyled,
  MenuItemStyled,
  MobOnly,
  UserInfo,
  UserMenuContainer,
} from './styles'
import './icon.css'
import { ReactComponent as ProfileIcon } from '../../assets/icon/PersonFilled.svg'
import { ReactComponent as NotificationsIcon } from '../../assets/icon/IoNotifications.svg'
import { ReactComponent as CalendarIcon } from '../../assets/icon/BiCalendar.svg'
import { ReactComponent as FriendsIcon } from '../../assets/icon/GiThreeFriends.svg'
import { ReactComponent as ReviewsIcon } from '../../assets/icon/MdReviews.svg'
import { ReactComponent as SignoutIcon } from '../../assets/icon/LogoutFilled.svg'

function UserMenu() {
  return (
    <UserMenuContainer>
      <UserInfo>
        <span>John Doue</span>
        <p>jdoe@acme.com</p>
      </UserInfo>
      <DividerStyled />
      <MobOnly>
        <MenuItemStyled>Meetings</MenuItemStyled>
        <MenuItemStyled>About</MenuItemStyled>
        <DividerStyled />
      </MobOnly>
      <MenuItemStyled>
        <ProfileIcon className="icon" /> Profile
      </MenuItemStyled>
      <MenuItemStyled>
        <NotificationsIcon className="icon" /> Notifications
      </MenuItemStyled>
      <MenuItemStyled>
        <CalendarIcon className="icon" /> Scheduled Meetings
      </MenuItemStyled>
      <MenuItemStyled>
        <FriendsIcon className="icon" /> Friends
      </MenuItemStyled>
      <MenuItemStyled>
        <ReviewsIcon className="icon" /> Reviews
      </MenuItemStyled>
      <DividerStyled />
      <MenuItemStyled>
        <SignoutIcon className="icon" /> Sign out
      </MenuItemStyled>
    </UserMenuContainer>
  )
}

export default UserMenu
