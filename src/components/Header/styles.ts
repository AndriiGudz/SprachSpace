import styled from '@emotion/styled'

export const HeaderBox = styled.div`
  display: flex;
  width: 100%;
  padding: 15px 32px;
  align-items: center;
  gap: 42px;

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
  gap: 42px;

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