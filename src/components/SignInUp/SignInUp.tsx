import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import CloseIcon from '@mui/icons-material/Close'
import { ReactComponent as GooglePlusIcon } from '../../assets/icons-google-plus.svg'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import {
  Container,
  FormContainer,
  OverlayContainer,
  Overlay,
  OverlayPanel,
  SocialContainer,
  TextBox,
  CloseButton,
  CloseButtonBlack,
  FormField,
  TextFieldBox,
} from './styles'
import { TextField } from '@mui/material'
import ButtonSign from '../ButtonSign/ButtonSign'

// Валидационные схемы
const SignInSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email')
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'This is not an acceptable email'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password is too short')
    .matches(/[a-z]/, 'Password must contain at least one small letter')
    .matches(/[A-Z]/, 'Password must contain at least one capital letter')
    .matches(/\d/, 'Password must contain at least one numerical digit')
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      'Password must contain at least one special symbol'
    ),
})

const SignUpSchema = Yup.object().shape({
  // name: Yup.string().required('Name is required'),
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email')
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'This is not an acceptable email'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password is too short')
    .matches(/[a-z]/, 'Password must contain at least one small letter')
    .matches(/[A-Z]/, 'Password must contain at least one capital letter')
    .matches(/\d/, 'Password must contain at least one numerical digit')
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      'Password must contain at least one special symbol'
    ),
  termsAccepted: Yup.boolean().oneOf(
    [true],
    'You must accept the terms and conditions'
  ),
})

function SignInUp() {
  const { t } = useTranslation()
  const [isRightPanelActive, setIsRightPanelActive] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
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

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  const handleLoginSubmit = async (values: {
    email: string
    password: string
  }) => {
    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Login successful:', data)
        // Действия при успешной авторизации
        navigate('/dashboard') // Перенаправление на другую страницу после успешного входа
      } else {
        const errorData = await response.json()
        console.error('Login failed:', errorData)
        alert(errorData.message || 'Login failed')
      }
    } catch (error) {
      console.error('An error occurred:', error)
      alert('An unexpected error occurred. Please try again later.')
    }
  }

  const handleRegisterSubmit = async (values: {
    email: string
    password: string
  }) => {
    try {
      const response = await fetch('http://localhost:8080/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...values, role: 'ROLE_USER' }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Registration successful:', data)
        // Действия после успешной регистрации, например, перенаправление
        navigate('/dashboard') // Перенаправление на другую страницу после успешной регистрации
      } else {
        const errorData = await response.json()
        console.error('Registration failed:', errorData)
        alert(errorData.message || 'Registration failed')
      }
    } catch (error) {
      console.error('An error occurred:', error)
      alert('An unexpected error occurred. Please try again later.')
    }
  }

  return (
    <Container className={isRightPanelActive ? 'right-panel-active' : ''}>
      {/* Форма Входа */}
      <FormContainer className="sign-in-container">
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={SignInSchema}
          onSubmit={handleLoginSubmit}
          validateOnBlur={true}
          validateOnChange={true}
          validateOnMount={false}
        >
          {() => (
            <FormField as={Form}>
              <h1>{t('signinUp.signInTitle')}</h1>
              <SocialContainer>
                <a href="#" className="social">
                  <GooglePlusIcon width="36" height="36" />
                </a>
              </SocialContainer>
              <span>{t('signinUp.orUseAccount')}</span>
              <TextFieldBox>
                <Field name="email">
                  {({ field, meta }: any) => (
                    <TextField
                      {...field}
                      label={t('signinUp.emailPlaceholder')}
                      type="email"
                      fullWidth
                      margin="normal"
                      className="inputSecondary"
                      helperText={meta.touched && meta.error ? meta.error : ''}
                      error={Boolean(meta.touched && meta.error)}
                    />
                  )}
                </Field>
                <Field name="password">
                  {({ field, meta }: any) => (
                    <TextField
                      {...field}
                      label={t('signinUp.passwordPlaceholder')}
                      type={showPassword ? 'text' : 'password'}
                      fullWidth
                      margin="normal"
                      className="inputSecondary"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleTogglePasswordVisibility}
                              edge="end"
                              type="button"
                            >
                              {showPassword ? (
                                <VisibilityOff fontSize="small" />
                              ) : (
                                <Visibility fontSize="small" />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      helperText={meta.touched && meta.error ? meta.error : ''}
                      error={Boolean(meta.touched && meta.error)}
                    />
                  )}
                </Field>
              </TextFieldBox>
              <a href="#">{t('signinUp.forgotPassword')}</a>
              <ButtonSign
                text={t('header.signIn')}
                variant="light"
                type="submit"
              />
            </FormField>
          )}
        </Formik>
      </FormContainer>

      {/* Форма Регистрации */}
      <FormContainer className="sign-up-container">
        <Formik
          initialValues={{
            name: '',
            email: '',
            password: '',
            termsAccepted: false,
          }}
          validationSchema={SignUpSchema}
          onSubmit={handleRegisterSubmit}
          validateOnBlur={true}
          validateOnChange={true}
          validateOnMount={false}
        >
          {({ values, handleChange }) => (
            <FormField as={Form}>
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
                {/* <Field name="name">
                  {({ field, meta }: any) => (
                    <TextField
                      {...field}
                      label={t('signinUp.namePlaceholder')}
                      type="text"
                      fullWidth
                      margin="normal"
                      className="inputSecondary"
                      helperText={meta.touched && meta.error ? meta.error : ''}
                      error={Boolean(meta.touched && meta.error)}
                    />
                  )}
                </Field> */}
                <Field name="email">
                  {({ field, meta }: any) => (
                    <TextField
                      {...field}
                      label={t('signinUp.emailPlaceholder')}
                      type="email"
                      fullWidth
                      margin="normal"
                      className="inputSecondary"
                      helperText={meta.touched && meta.error ? meta.error : ''}
                      error={Boolean(meta.touched && meta.error)}
                    />
                  )}
                </Field>
                <Field name="password">
                  {({ field, meta }: any) => (
                    <TextField
                      {...field}
                      label={t('signinUp.passwordPlaceholder')}
                      type={showPassword ? 'text' : 'password'}
                      fullWidth
                      margin="normal"
                      className="inputSecondary"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleTogglePasswordVisibility}
                              edge="end"
                              type="button"
                            >
                              {showPassword ? (
                                <VisibilityOff fontSize="small" />
                              ) : (
                                <Visibility fontSize="small" />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      helperText={meta.touched && meta.error ? meta.error : ''}
                      error={Boolean(meta.touched && meta.error)}
                    />
                  )}
                </Field>
              </TextFieldBox>
              <FormControlLabel
                control={
                  <Checkbox
                    name="termsAccepted"
                    checked={values.termsAccepted}
                    onChange={handleChange}
                  />
                }
                label={t('signinUp.acceptTerms')}
              />
              <ErrorMessage
                name="termsAccepted"
                render={(msg) => <div style={{ color: 'red' }}>{msg}</div>}
              />

              <ButtonSign
                type="submit"
                text={t('header.signUp')}
                variant="light"
              />
            </FormField>
          )}
        </Formik>
      </FormContainer>

      {/* Overlay Panels */}
      <OverlayContainer>
        <Overlay className="overlay">
          <OverlayPanel className="overlay-left" isLeft>
            <h1>{t('signinUp.welcomeBack')}</h1>
            <TextBox>
              <p>{t('signinUp.welcomeBackText')}</p>
            </TextBox>
            <ButtonSign
              text={t('header.signIn')}
              onClick={handleSignInClick}
              variant="dark"
              type="button"
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
            <ButtonSign
              text={t('header.signUp')}
              onClick={handleSignUpClick}
              variant="dark"
              type="button"
            />
          </OverlayPanel>
        </Overlay>
      </OverlayContainer>
    </Container>
  )
}

export default SignInUp
