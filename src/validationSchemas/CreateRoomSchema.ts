import * as yup from 'yup'
import { TFunction } from 'i18next'

// Получаем минимальное время начала (текущее время + 5 минут)
const getMinStartTime = () => {
  const now = new Date()
  now.setMinutes(now.getMinutes() + 5)
  return now
}

// Получаем минимальное время окончания (время начала + 15 минут)
const getMinEndTime = (startTime: Date) => {
  const start = new Date(startTime)
  start.setMinutes(start.getMinutes() + 15)
  return start
}

export interface CreateRoomFormData {
  name: string
  category: string
  language: string
  proficiency: string
  openAt: string
  closeAt: string
  minParticipants: number
  maxParticipants?: number | null
  ageLimit?: number | null
  privateRoom: boolean
}

export const createRoomSchema = (t: TFunction) =>
  yup.object().shape({
    name: yup
      .string()
      .required(t('validation.createRoom.nameRequired'))
      .min(3, t('validation.createRoom.nameMin'))
      .max(50, t('validation.createRoom.nameMax'))
      .matches(
        /^[a-zA-Zа-яА-ЯёЁ0-9\s-]+$/,
        t('validation.createRoom.nameFormat')
      ),
    category: yup
      .string()
      .required(t('validation.createRoom.categoryRequired')),
    language: yup
      .string()
      .required(t('validation.createRoom.languageRequired')),
    proficiency: yup
      .string()
      .required(t('validation.createRoom.proficiencyRequired')),
    openAt: yup
      .string()
      .required(t('validation.createRoom.openTimeRequired'))
      .test(
        'min-start-time',
        t('validation.createRoom.openTimeMin') || '',
        (value) => {
          if (!value) return true
          return new Date(value) >= getMinStartTime()
        }
      ),
    closeAt: yup
      .string()
      .required(t('validation.createRoom.closeTimeRequired'))
      .test(
        'min-end-time',
        t('validation.createRoom.closeTimeMin') || '',
        function (value) {
          if (!value || !this.parent.openAt) return true
          const startDate = new Date(this.parent.openAt)
          const endDate = new Date(value)
          const minEnd = getMinEndTime(startDate)
          return endDate >= minEnd
        }
      ),
    minParticipants: yup
      .number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .required(t('validation.createRoom.minParticipantsRequired'))
      .min(4, t('validation.createRoom.minParticipantsMin'))
      .integer(t('validation.createRoom.integer') || ''),
    maxParticipants: yup
      .number()
      .transform((value) =>
        isNaN(value) || value === null ? undefined : value
      )
      .required(t('validation.createRoom.maxParticipantsRequired'))
      .integer(t('validation.createRoom.integer') || '')
      .min(
        yup.ref('minParticipants'),
        ({ min }) =>
          `${
            t('validation.createRoom.maxParticipantsMin', { count: min }) ||
            `Max participants must be greater than or equal to min participants (${min})`
          }`
      )
      .max(100, t('validation.createRoom.maxParticipantsMax')),
    ageLimit: yup
      .number()
      .transform((value) =>
        isNaN(value) || value === null ? undefined : value
      )
      .nullable()
      .integer(t('validation.createRoom.integer') || '')
      .min(0, t('validation.createRoom.minAge') || ''),
    privateRoom: yup.boolean().defined(),
  })
