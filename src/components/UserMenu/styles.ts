import styled from '@emotion/styled'
import { Divider, MenuItem } from '@mui/material'
import { Link } from 'react-router-dom'

export const LinkStyle = styled(Link)`
  color: inherit;
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  box-sizing: border-box;

  &:hover {
    transform: translateX(4px);
  }
`

export const UserMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 320px;
  padding: 24px;
  border-radius: 20px;
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(255, 255, 255, 0.05);
  position: relative;
  z-index: 1000;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #01579b 0%, #0280c7 50%, #ff6b35 100%);
    border-radius: 20px 20px 0 0;
  }

  @media (max-width: 900px) {
    width: 100%;
    max-width: 420px;
    min-width: 350px;
    border-radius: 16px;
    padding: 20px;
    gap: 6px;
  }

  @media (max-width: 480px) {
    min-width: 320px;
    max-width: 100%;
    padding: 16px;
  }
`

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  border-radius: 16px;
  background: linear-gradient(135deg, #01579b 0%, #0280c7 100%);
  color: white;
  position: relative;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 70%
    );
    animation: shimmer 3s ease-in-out infinite;
  }

  @keyframes shimmer {
    0%,
    100% {
      transform: translateX(100%) translateY(100%);
    }
    50% {
      transform: translateX(-100%) translateY(-100%);
    }
  }

  span {
    font-weight: 600;
    font-size: 18px;
    letter-spacing: 0.5px;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  p {
    margin: 0;
    opacity: 0.9;
    font-size: 14px;
    font-weight: 400;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  @media (max-width: 900px) {
    padding: 14px;
    gap: 6px;

    span {
      font-size: 16px;
    }

    p {
      font-size: 13px;
    }
  }
`

export const MenuItemStyled = styled(MenuItem)`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 16px;
  border-radius: 12px;
  margin: 2px 0;
  color: #334155;
  font-weight: 500;
  font-size: 15px;
  letter-spacing: 0.3px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  min-height: 48px;
  width: 100%;
  box-sizing: border-box;

  /* Разрешаем перенос текста для длинных названий */
  @media (max-width: 900px) {
    white-space: normal;
    word-wrap: break-word;
    line-height: 1.3;
    padding: 12px 14px;
    gap: 12px;
    font-size: 14px;
    min-height: auto;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(1, 87, 155, 0.1),
      transparent
    );
    transition: left 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover {
    background: linear-gradient(
      135deg,
      rgba(1, 87, 155, 0.08) 0%,
      rgba(2, 128, 199, 0.05) 100%
    );
    color: #01579b;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(1, 87, 155, 0.15);

    &::before {
      left: 100%;
    }

    .icon {
      transform: scale(1.1);
      filter: drop-shadow(0 2px 4px rgba(1, 87, 155, 0.3));
    }
  }

  &:active {
    transform: translateY(0px);
  }
`

export const DividerStyled = styled(Divider)`
  margin: 6px 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(0, 0, 0, 0.1) 50%,
    transparent 100%
  );
  border: none;

  @media (max-width: 900px) {
    margin: 4px 0;
  }
`

export const UserNav = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  @media (max-width: 900px) {
    gap: 2px;
  }
`

export const MobOnly = styled.div`
  display: none;

  @media (max-width: 900px) {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
`

export const MobLangSel = styled.div`
  display: none;

  @media (max-width: 900px) {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-top: 4px;
  }
`

export const NotificationBadge = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  .MuiBadge-badge {
    background: linear-gradient(135deg, #ff6b35 0%, #ff8f65 100%);
    color: white;
    font-weight: 600;
    font-size: 11px;
    height: 20px;
    min-width: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(255, 107, 53, 0.4);
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }
`

export const AdminBadge = styled.div`
  position: absolute;
  top: -4px;
  right: -4px;
  width: 12px;
  height: 12px;
  background: linear-gradient(135deg, #ff6b35 0%, #ff8f65 100%);
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(255, 107, 53, 0.3);
`

export const LogoutButton = styled(MenuItemStyled)`
  margin-top: 6px;
  background: linear-gradient(
    135deg,
    rgba(239, 68, 68, 0.05) 0%,
    rgba(220, 38, 38, 0.03) 100%
  );
  color: #dc2626;
  border: 1px solid rgba(239, 68, 68, 0.2);

  &:hover {
    background: linear-gradient(
      135deg,
      rgba(239, 68, 68, 0.1) 0%,
      rgba(220, 38, 38, 0.08) 100%
    );
    color: #b91c1c;
    border-color: rgba(239, 68, 68, 0.3);
  }

  @media (max-width: 900px) {
    margin-top: 4px;
  }
`

export const SignInButton = styled(MenuItemStyled)`
  margin-top: 6px;
  background: linear-gradient(135deg, #01579b 0%, #0280c7 100%);
  color: white;
  font-weight: 600;

  &:hover {
    background: linear-gradient(135deg, #013d6b 0%, #0267a3 100%);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(1, 87, 155, 0.3);
  }

  .icon {
    filter: brightness(0) invert(1);
  }

  @media (max-width: 900px) {
    margin-top: 4px;
  }
`
