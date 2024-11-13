import styled from '@emotion/styled'

// Основной контейнер
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #fff;

  // Перемещение форм при активации панели
  &.right-panel-active .sign-in-container {
    transform: translateY(-100%); // Поднимается вверх при активации
    opacity: 0;
    z-index: 1;
  }

  &.right-panel-active .sign-up-container {
    transform: translateY(0); // Поднимается вверх, чтобы стать видимой
    opacity: 1;
    z-index: 2;
  }
`

// Контейнер для формы (sign-in и sign-up)
export const FormContainer = styled.div`
  position: absolute;
  background-color: #fff;
  top: 0;
  height: 100%;
  transition: transform 0.6s ease-in-out;
  width: 320px;
  padding-bottom: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  opacity: 1;

  &.sign-in-container {
    transform: translateY(0);
    z-index: 2;
  }

  &.sign-up-container {
    opacity: 0;
    z-index: 1;
    transform: translateY(100%);
  }

  // Перемещение формы sign-up при активации
  &.right-panel-active.sign-up-container {
    top: 0;
    transform: translateY(0);
    opacity: 1;
    z-index: 2;
  }
`

export const FormField = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 24px;

  h1 {
    margin: 0;
    padding: 0;
  }

  span {
    color: #616161;
  }

  a {
    color: #616161;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`

export const TextFieldBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 14px;
`

// Контейнер для overlay
export const OverlayContainer = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  transition: transform 0.6s ease-in-out;
  z-index: 3;
`

// Overlay (нижняя плашка) с двумя панелями, которые остаются на месте
export const Overlay = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;

  border-radius: 4px 4px var(--none, 0px) var(--none, 0px);
  background: #fff;
  box-shadow: 0px 0px 24px 0px rgba(0, 0, 0, 0.25);
`

// Панели внутри overlay (sign-in и sign-up)
export const OverlayPanel = styled.div<{ isLeft?: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  h1 {
    color: #bdbdbd;
    font-family: Oswald;
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: 100%;
    letter-spacing: 0.48px;
    margin: 0;
    padding-bottom: 4px;
  }
`

export const ArrowTextBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px 24px;
`

// Социальные иконки
export const SocialContainer = styled.div`
  a {
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }
`

// Общие стили для формы, кнопки, и полей ввода
export const Form = styled.form`
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 50px;
  width: 100%;
  height: 100%;
  text-align: center;
`

export const ButtonSign = styled.button`
  border-radius: 20px;
  border: 1px solid #ff4b2b;
  background-color: #ff4b2b;
  color: #fff;
  font-size: 12px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: transform 80ms ease-in;
  cursor: pointer;
  &:active {
    transform: scale(0.95);
  }
`

// Иконка Close, расположена в верхнем правом углу
export const CloseButton = styled.div`
  position: absolute;
  top: 32px;
  right: 32px;
  cursor: pointer;
  color: #212121;
  transition: opacity 0.2s ease-in-out;
  z-index: 3;

  &:hover {
    opacity: 0.7;
  }
`