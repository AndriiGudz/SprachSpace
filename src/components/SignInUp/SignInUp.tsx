import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CloseIcon from '@mui/icons-material/Close'
import { ReactComponent as GooglePlusIcon } from '../../assets/icons-google-plus.svg'
import {
  Container,
  FormContainer,
  OverlayContainer,
  Overlay,
  OverlayPanel,
  SocialContainer,
  ButtonSign,
  TextBox,
  CloseButton,
  CloseButtonBlack,
  FormField,
  TextFieldBox,
} from './styles'
import ButtonSignFFF from '../ButtonSignFFF/ButtonSignFFF'
import { TextField } from '@mui/material' // Импортируем TextField из MUI
import ButtonSignBl from '../ButtonSignBl/ButtonSignBl'

function SignInUp() {
  const { t } = useTranslation()
  const [isRightPanelActive, setIsRightPanelActive] = useState(false)
  const navigate = useNavigate()

  const handleSignInClick = () => {
    setIsRightPanelActive(false)
  }

  const handleSignUpClick = () => {
    setIsRightPanelActive(true)
  }

  const handleCloseClick = () => {
    navigate(-1)
  }

  return (
    <Container className={isRightPanelActive ? 'right-panel-active' : ''}>
      <FormContainer className="sign-in-container">
        <FormField>
          <h1>{t('signinUp.signInTitle')}</h1>
          <SocialContainer>
            <a href="#" className="social">
              <GooglePlusIcon width="36" height="36" />
            </a>
          </SocialContainer>
          <span>{t('signinUp.orUseAccount')}</span>
          <TextFieldBox>
          <TextField
            label={t('signinUp.emailPlaceholder')}
            type="email"
            className="inputSecondary"
            fullWidth
            margin="normal"
          />
          <TextField
            label={t('signinUp.passwordPlaceholder')}
            type="password"
            className="inputSecondary"
            fullWidth
            margin="normal"
          />
          </TextFieldBox>
          <a href="#">{t('signinUp.forgotPassword')}</a>
          <ButtonSign>{t('header.signIn')}</ButtonSign>
          <ButtonSignBl text={t('header.signIn')} onClick={handleCloseClick} />
        </FormField>
      </FormContainer>

      <FormContainer className="sign-up-container">
        <FormField>
          <CloseButtonBlack onClick={handleCloseClick}>
            <CloseIcon fontSize="small" />
          </CloseButtonBlack>
          <h1>{t('signinUp.signUpTitle')}</h1>
          <SocialContainer>
            <a href="#" className="social">
              <GooglePlusIcon width="36" height="36" />
            </a>
          </SocialContainer>
          <span>{t('signinUp.orUseEmail')}</span>
          <TextFieldBox>
          <TextField
            label={t('signinUp.namePlaceholder')}
            type="text"
            className="inputSecondary"
            fullWidth
            margin="normal"
          />
          <TextField
            label={t('signinUp.emailPlaceholder')}
            type="email"
            className="inputSecondary"
            fullWidth
            margin="normal"
          />
          <TextField
            label={t('signinUp.passwordPlaceholder')}
            type="password"
            className="inputSecondary"
            fullWidth
            margin="normal"
          />
          </TextFieldBox>
          <ButtonSign>{t('header.signUp')}</ButtonSign>
        </FormField>
      </FormContainer>

      <OverlayContainer>
        <Overlay className="overlay">
          <OverlayPanel className="overlay-left" isLeft>
            <h1>{t('signinUp.welcomeBack')}</h1>
            <TextBox>
              <p>{t('signinUp.welcomeBackText')}</p>
            </TextBox>
            <ButtonSignFFF
              text={t('header.signIn')}
              onClick={handleSignInClick}
            />
          </OverlayPanel>
          <OverlayPanel className="overlay-right">
            <CloseButton onClick={handleCloseClick}>
              <CloseIcon fontSize="small" />
            </CloseButton>
            <h1>{t('signinUp.helloFriend')}</h1>
            <TextBox>
              <p>{t('signinUp.helloFriendText')}</p>
            </TextBox>
            <ButtonSignFFF
              text={t('header.signUp')}
              onClick={handleSignUpClick}
            />
          </OverlayPanel>
        </Overlay>
      </OverlayContainer>
    </Container>
  )
}

export default SignInUp
