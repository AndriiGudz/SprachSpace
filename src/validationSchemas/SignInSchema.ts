import * as Yup from 'yup'
import i18n from 'i18next'

export const SignInSchema = Yup.object().shape({
  email: Yup.string()
    .required(i18n.t('signinUp.emailRequired'))
    .email(i18n.t('signinUp.invalidEmail'))
    .matches(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      i18n.t('signinUp.notAcceptableEmail')
    ),
  password: Yup.string()
    .required(i18n.t('signinUp.passwordRequired'))
    .min(8, i18n.t('signinUp.shortPassword'))
    .matches(/[a-z]/, i18n.t('signinUp.smallLetter'))
    .matches(/[A-Z]/, i18n.t('signinUp.capitalLetter'))
    .matches(/\d/, i18n.t('signinUp.numberRequired'))
    .matches(/[!@#$%^&*(),.?":{}|<>]/, i18n.t('signinUp.specialSymbol')),
})
