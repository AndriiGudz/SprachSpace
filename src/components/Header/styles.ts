import styled from '@emotion/styled'

export const HeaderBox = styled.div`
  position: fixed;
  display: flex;
  width: 100%;
  padding: 15px 32px;
  align-items: center;
  gap: 42px;
  z-index: 1000;

  background: #fff;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);

  @media (max-width: 900px) {
    padding: 10px 24px;
  }
`

// Контейнер для логотипа с адаптивным размером
export const LogoContainer = styled.a`
  display: flex;
  align-items: center;
  cursor: pointer;

  svg {
    width: 252px;
    height: 70px;
    transition: width 0.3s ease, height 0.3s ease;

    @media (max-width: 900px) {
      width: 140px;
      height: 40px;
    }
  }
`

export const DesktopOnly = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: flex-end;
  gap: 24px;

  @media (max-width: 900px) {
    display: none;
  }
`

export const MenuButton = styled.div`
  display: none;

  @media (max-width: 900px) {
    display: flex;
    margin-left: auto;
    cursor: pointer;
  }
`

export const AvatarContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;

  img {
    border-radius: 50%;
    object-fit: cover;
  }

  &:hover {
    filter: drop-shadow(0px 0px 24px rgba(1, 87, 155, 0.25));
  }
`

export const MobileAvatar = styled.div`
  display: none;

  @media (max-width: 900px) {
    display: flex;
    margin-left: auto;
    align-items: center;

    img {
      border-radius: 50%;
      width: 36px;
      height: 36px;
      object-fit: cover;
    }
  }
`

export const UserMenuWrapper = styled.div`
  position: absolute;
  top: 100%;
  right: 32px;
  background: white;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;

  @media (max-width: 900px) {
    right: 24px;
    width: 200px;
  }
`

export const LanguageSelectorContainer = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 900px) {
    margin: 8px 0;
  }
`
