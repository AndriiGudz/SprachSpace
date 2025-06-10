import { Box, TextField, Avatar, IconButton } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import EditIcon from '@mui/icons-material/Edit'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { useTranslation } from 'react-i18next'
import { PersonalDataSectionProps } from './types'
import dayjs from 'dayjs'
import EditableSection from '../EditableSection/EditableSection'
import { useRef, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  updateUser,
  loadUserAvatar,
} from '../../store/redux/userSlice/userSlice'
import { uploadAvatar } from '../../api/userApi'
import { RootState, AppDispatch } from '../../store/store'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function PersonalDataBox({
  data,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onChange,
}: PersonalDataSectionProps) {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const userData = useSelector((state: RootState) => state.user)

  const [avatarDisplayUrl, setAvatarDisplayUrl] = useState<string | undefined>(
    undefined
  )

  useEffect(() => {
    let currentObjectURL: string | undefined

    // Если не редактируем, используем avatarDisplayUrl из store
    if (!isEditing && userData.avatarDisplayUrl) {
      setAvatarDisplayUrl(userData.avatarDisplayUrl)
      return
    }

    // Для режима редактирования загружаем аватар через Redux
    if (
      isEditing &&
      userData.id &&
      userData.foto &&
      userData.accessToken &&
      !userData.avatarDisplayUrl
    ) {
      dispatch(
        loadUserAvatar({
          fotoFileName: userData.foto,
          accessToken: userData.accessToken,
        })
      )
    }

    // Обновляем локальное состояние когда avatarDisplayUrl изменяется в store
    if (userData.avatarDisplayUrl) {
      setAvatarDisplayUrl(userData.avatarDisplayUrl)
    } else if (!userData.foto) {
      setAvatarDisplayUrl(undefined)
    }

    return () => {
      if (currentObjectURL && currentObjectURL.startsWith('blob:')) {
        URL.revokeObjectURL(currentObjectURL)
      }
    }
  }, [
    dispatch,
    userData.id,
    userData.foto,
    userData.accessToken,
    userData.avatarDisplayUrl,
    isEditing,
  ])

  const isEmpty =
    !data.nickname || !data.name || !data.surname || !data.birthdayDate

  const handleAvatarEditClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (file && userData.id && userData.accessToken) {
      try {
        const response = await uploadAvatar(
          userData.id,
          file,
          userData.accessToken
        )
        dispatch(updateUser({ foto: response.foto }))
        // После обновления foto загружаем новый аватар
        if (response.foto && userData.accessToken) {
          dispatch(
            loadUserAvatar({
              fotoFileName: response.foto,
              accessToken: userData.accessToken,
            })
          )
        }
        toast.success(t('personalData.avatarUploadedSuccess'))
      } catch (error) {
        if (error instanceof Error) {
          toast.error(
            `${t('personalData.avatarUploadError')}: ${error.message}`
          )
        } else {
          toast.error(t('personalData.avatarUploadError'))
        }
      }
    }
  }

  const handleSave = async () => {
    if (onSave) {
      await onSave()
    }
  }

  return (
    <EditableSection
      title={t('personalData.title')}
      isEditing={isEditing}
      isEmpty={isEmpty}
      onEdit={onEdit}
      onSave={handleSave}
      onCancel={onCancel}
    >
      <Box display="flex" flexDirection="column" gap={2}>
        <Box position="relative" width="fit-content">
          <Avatar
            sx={{
              width: 100,
              height: 100,
              mb: 1,
              '& img': {
                marginRight: 0,
              },
            }}
          >
            {avatarDisplayUrl ? (
              <img
                src={avatarDisplayUrl}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                alt="User Avatar"
                loading="lazy"
              />
            ) : (
              <AccountCircleIcon sx={{ width: '100%', height: '100%' }} />
            )}
          </Avatar>
          {isEditing && (
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
                accept="image/*"
              />
              <IconButton
                size="small"
                onClick={handleAvatarEditClick}
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  right: -8,
                  backgroundColor: 'white',
                  '&:hover': { backgroundColor: '#f5f5f5' },
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </>
          )}
        </Box>

        <TextField
          label={t('personalData.nickname')}
          value={data.nickname || ''}
          onChange={(e) => onChange({ nickname: e.target.value })}
          disabled={!isEditing}
          fullWidth
          className="inputGrey"
        />
        <TextField
          label={t('personalData.name')}
          value={data.name || ''}
          onChange={(e) => onChange({ name: e.target.value })}
          disabled={!isEditing}
          fullWidth
          className="inputGrey"
        />
        <TextField
          label={t('personalData.surname')}
          value={data.surname || ''}
          onChange={(e) => onChange({ surname: e.target.value })}
          disabled={!isEditing}
          fullWidth
          className="inputGrey"
        />
        <DatePicker
          label={t('personalData.birthdayDate')}
          value={data.birthdayDate ? dayjs(data.birthdayDate) : null}
          onChange={(date) =>
            onChange({ birthdayDate: date?.toISOString() || null })
          }
          disabled={!isEditing}
          sx={{
            '& .MuiInputBase-root': {
              backgroundColor: '#EEE',
            },
          }}
        />
      </Box>
    </EditableSection>
  )
}

export default PersonalDataBox
