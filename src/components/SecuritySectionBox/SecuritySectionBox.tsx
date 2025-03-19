import { useState } from 'react'
import {
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store/store'
import { clearUser } from '../../store/redux/userSlice/userSlice'
import { useNavigate } from 'react-router-dom'
import { SecuritySectionProps } from './types'
import EditableSection from '../EditableSection/EditableSection'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

function SecuritySectionBox({
  data,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onChange,
}: SecuritySectionProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Получаем userId из глобального состояния (Redux)
  const userId = useSelector((state: RootState) => state.user.id)

  const isEmpty = !data.email

  // Локальное состояние для управления открытием/закрытием диалога
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

  // Обработчик для нажатия на кнопку «Удалить аккаунт» (в режиме редактирования)
  const handleDeleteAccountClick = () => {
    if (isEditing) {
      setOpenDeleteDialog(true)
    }
  }

  // Обработчик для подтверждения удаления аккаунта
  const handleConfirmDelete = async () => {
    if (!userId) {
      toast.error('No user ID found')
      setOpenDeleteDialog(false)
      return
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/users/delete?id=${userId}`,
        {
          method: 'DELETE',
        }
      )

      if (response.ok) {
        // Предположим, что сервер возвращает код 200 при успешном удалении
        toast.success(t('securitySection.accountDeleted'))
        // Вызываем экшен clearUser, чтобы очистить данные
        dispatch(clearUser())
        // Перенаправляем на главную страницу
        navigate('/')
      } else {
        toast.error('Failed to delete account')
      }
    } catch (error) {
      console.error('Error deleting account:', error)
      toast.error(t('securitySection.accountDeleteError'))
    } finally {
      setOpenDeleteDialog(false)
    }
  }

  // Обработчик для отмены (закрытия диалога)
  const handleCancelDelete = () => {
    setOpenDeleteDialog(false)
  }

  return (
    <>
      <EditableSection
        title={t('securitySection.title')}
        isEditing={isEditing}
        isEmpty={isEmpty}
        onEdit={onEdit}
        onSave={onSave}
        onCancel={onCancel}
      >
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label={t('securitySection.emailLabel')}
            type="email"
            value={data.email}
            onChange={(e) => onChange({ email: e.target.value })}
            disabled
            fullWidth
            className="inputGrey"
          />

          {data.backupEmail && (
            <TextField
              label={t('securitySection.backupEmailLabel')}
              type="email"
              value={data.backupEmail}
              onChange={(e) => onChange({ backupEmail: e.target.value })}
              disabled={!isEditing}
              fullWidth
              className="inputGrey"
            />
          )}

          {isEditing && !data.backupEmail && (
            <Button
              variant="text"
              onClick={() => onChange({ backupEmail: '' })}
              sx={{ alignSelf: 'flex-start' }}
            >
              {t('securitySection.addBackupEmail')}
            </Button>
          )}

          {/* Кнопка для изменения пароля */}
          {!isEditing && (
            <Button
              variant="text"
              onClick={() => {
                // Заглушка для изменения пароля
                console.log('Change password action triggered')
              }}
              sx={{ alignSelf: 'flex-start' }}
            >
              {t('securitySection.changePassword')}
            </Button>
          )}

          {/* Кнопка для удаления аккаунта */}
          <Button
            variant="outlined"
            color="error"
            disabled={!isEditing} // в обычном режиме кнопка неактивна
            onClick={handleDeleteAccountClick}
            sx={{ alignSelf: 'flex-start' }}
          >
            {t('securitySection.deleteAccount')}
          </Button>
        </Box>
      </EditableSection>

      {/* Диалоговое окно подтверждения удаления аккаунта */}
      <Dialog open={openDeleteDialog} onClose={handleCancelDelete}>
        <DialogTitle>
          {t('securitySection.deleteAccountDialogTitle')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('securitySection.deleteAccountDialogMessage')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>
            {t('securitySection.cancel')}
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            {t('securitySection.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default SecuritySectionBox
