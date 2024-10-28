import styled from '@emotion/styled'

// Основной контейнер
export const Container = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #fff;

  // Перемещение форм при активации правой панели
  &.right-panel-active .sign-in-container {
    transform: translateX(100%);
    opacity: 0;
    z-index: 1;
  }

  &.right-panel-active .sign-up-container {
    transform: translateX(0);
    opacity: 1;
    z-index: 2;
  }
`

// Контейнер для формы (sign-in и sign-up)
export const FormContainer = styled.div<{ isSignIn?: boolean }>`
  position: absolute;
  background-color: #fff;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
  left: ${(props) => (props.isSignIn ? '0' : '50%')};
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  z-index: 2;
  opacity: 1;

  &.sign-in-container {
    left: 0;
    z-index: 2;
  }

  &.sign-up-container {
    left: 50%;
    opacity: 0;
    z-index: 1;
    transform: translateX(-100%);
  }

  // Добавляем прозрачность и скрытие для инверсии положения форм
  &.right-panel-active & {
    transform: translateX(100%);
    opacity: 0;
  }
`

export const FormField = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
  gap: 24px;

  h1 {
    margin: 0;
    padding: 0;
  }

  span {
    color: #616161;
  }
`

export const TextFieldBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 14px;
`

// Контейнер для overlay (блокирует движение)
export const OverlayContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  transition: transform 0.6s ease-in-out;
  z-index: 1;
`

// Overlay (задний фон) с двумя панелями, которые остаются на месте
export const Overlay = styled.div`
  /* background: linear-gradient(to right, #ff4b2b, #ff416c); */
  color: #fff;
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
`

// Панели внутри overlay (левая и правая)
export const OverlayPanel = styled.div<{ isLeft?: boolean }>`
  background: linear-gradient(
    194deg,
    #01579b 20.12%,
    #0280c7 50%,
    #03a9f4 79.88%
  );
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  gap: 32px;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
  right: ${(props) => (props.isLeft ? 'auto' : '0')};

  h1 {
    background: var(
      --Summer-Dog,
      linear-gradient(90deg, #a8ff78 0%, #78ffd6 100%)
    );
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0;
    padding: 0;
  }

  p {
    margin: 0;
    padding: 0;
    line-height: 32px;
  }

  // Если панель левая, то позиционируем ее слева
  ${(props) =>
    props.isLeft &&
    `
    left: 0;
    transform: translateX(0);
  `}
`

export const TextBox = styled.div`
  display: flex;
  width: 240px;
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
  color: #fff;
  transition: opacity 0.2s ease-in-out;

  &:hover {
    opacity: 0.7;
  }
`
export const CloseButtonBlack = styled.div`
  position: absolute;
  top: 32px;
  right: 32px;
  cursor: pointer;
  color: #212121;
  transition: opacity 0.2s ease-in-out;

  &:hover {
    opacity: 0.7;
  }
`
