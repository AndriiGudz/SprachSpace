import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Formik, Field, Form, ErrorMessage, FieldProps } from 'formik'
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
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { setUser, setTokens } from '../../store/redux/userSlice/userSlice'
import { SignInSchema } from '../../validationSchemas/SignInSchema'
import { SignUpSchema } from '../../validationSchemas/SignUpSchema'
import * as Yup from 'yup'

interface SignInValues {
  email: string
  password: string
}

interface SignUpValues {
  email: string
  password: string
  termsAccepted: boolean
}

function SignInUp() {
  const { t, i18n } = useTranslation()
  const [isRightPanelActive, setIsRightPanelActive] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [signInValidationSchema, setSignInValidationSchema] = useState<
    Yup.ObjectSchema<SignInValues> | undefined
  >(undefined)
  const [signUpValidationSchema, setSignUpValidationSchema] = useState<
    Yup.ObjectSchema<SignUpValues> | undefined
  >(undefined)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    // Если переводы инициализированы, создаем схемы
    if (i18n.isInitialized) {
      setSignInValidationSchema(SignInSchema)
      setSignUpValidationSchema(SignUpSchema)
    } else {
      // Иначе слушаем событие инициализации переводов
      const handleInit = () => {
        setSignInValidationSchema(SignInSchema)
        setSignUpValidationSchema(SignUpSchema)
      }

      i18n.on('initialized', handleInit)

      // Очистка слушателя при размонтировании
      return () => {
        i18n.off('initialized', handleInit)
      }
    }
  }, [i18n])

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

  const handleLoginSubmit = async (values: SignInValues) => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (response.ok) {
        const data = await response.json()

        // Сначала устанавливаем токены
        dispatch(
          setTokens({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          })
        )

        // Затем устанавливаем данные пользователя (без токенов, они уже установлены)
        dispatch(
          setUser({
            id: data.id,
            nickname: data.nickname,
            name: data.name,
            surname: data.surname,
            email: data.email,
            birthdayDate: data.birthdayDate,
            avatar: data.avatar,
            foto: data.avatar, // Используем avatar из ответа сервера
            rating: data.rating,
            internalCurrency: data.internalCurrency,
            status: data.status,
            nativeLanguages: data.nativeLanguages || [],
            learningLanguages: data.learningLanguages || [],
            roles: data.roles || [],
            createdRooms: data.createdRooms || [],
            message: data.message,
          })
        )

        toast.success(t('signinUp.loginSuccess'))
        navigate('/')
      } else {
        const errorData = await response.json()
        console.error(t('signinUp.loginFailed:'), errorData)
        toast.error(errorData.message || t('signinUp.loginFailed'))
      }
    } catch (error) {
      console.error('An error occurred:', error)
      toast.error(t('signinUp.unexpectedError'))
    }
  }

  const handleRegisterSubmit = async (values: SignUpValues) => {
    try {
      const response = await fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...values, role: 'ROLE_USER' }),
      })

      if (response.ok) {
        const registrationData = await response.json()

        // Показываем успешную регистрацию
        toast.success(t('signinUp.registrationSuccess'))

        // Автоматически авторизуем пользователя после регистрации
        try {
          const loginResponse = await fetch(
            'http://localhost:8080/api/auth/login',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: values.email,
                password: values.password,
              }),
            }
          )

          if (loginResponse.ok) {
            const loginData = await loginResponse.json()

            // Сначала устанавливаем токены
            dispatch(
              setTokens({
                accessToken: loginData.accessToken,
                refreshToken: loginData.refreshToken,
              })
            )

            // Затем устанавливаем данные пользователя
            dispatch(
              setUser({
                id: loginData.id,
                nickname: loginData.nickname,
                name: loginData.name,
                surname: loginData.surname,
                email: loginData.email,
                birthdayDate: loginData.birthdayDate,
                avatar: loginData.avatar,
                foto: loginData.avatar,
                rating: loginData.rating,
                internalCurrency: loginData.internalCurrency,
                status: loginData.status,
                nativeLanguages: loginData.nativeLanguages || [],
                learningLanguages: loginData.learningLanguages || [],
                roles: loginData.roles || [],
                createdRooms: loginData.createdRooms || [],
                message: loginData.message,
              })
            )

            toast.success(t('signinUp.autoLoginSuccess'))
            navigate('/')
          } else {
            // Если автоматическая авторизация не удалась, сохраняем данные без токенов
            dispatch(setUser(registrationData))
            toast.info(t('signinUp.registrationSuccessLoginManually'))
            navigate('/')
          }
        } catch (autoLoginError) {
          // Если ошибка автоматической авторизации, сохраняем данные без токенов
          dispatch(setUser(registrationData))
          toast.info(t('signinUp.registrationSuccessLoginManually'))
          navigate('/')
        }
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || t('signinUp.registrationFailed'))
      }
    } catch (error) {
      toast.error(t('signinUp.unexpectedError'))
    }
  }

  if (!signInValidationSchema || !signUpValidationSchema) {
    // Пока схемы валидации еще не готовы, отображаем индикатор загрузки
    return <div>Loading...</div>
  }

  return (
    <Container className={isRightPanelActive ? 'right-panel-active' : ''}>
      {/* Форма Входа */}
      <FormContainer className="sign-in-container">
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={signInValidationSchema}
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
                  {({ field, meta }: FieldProps<string>) => (
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
                  {({ field, meta }: FieldProps<string>) => (
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
            email: '',
            password: '',
            termsAccepted: false,
          }}
          validationSchema={signUpValidationSchema}
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
                <Field name="email">
                  {({ field, meta }: FieldProps<string>) => (
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
                  {({ field, meta }: FieldProps<string>) => (
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
