import { useState } from 'react'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Tooltip,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import CreateRoomForm, { Room } from '../CreateRoomForm/CreateRoomForm'
import { useTranslation } from 'react-i18next'
import { SxProps, Theme } from '@mui/material/styles'
import { useSelector } from 'react-redux'
import { UserSliceState } from '../../store/redux/userSlice/types'

// Стили для кнопки, можно вынести в отдельный файл если будут расширяться
const defaultCreateButtonStyle: SxProps<Theme> = {
  display: 'flex',
  padding: '10px 24px',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '10px',
  borderRadius: '10px',
  textTransform: 'none',
  background: 'var(--light-blue-darken-1, #039BE5)',

  '&:hover': {
    background: 'var(--light-blue-darken-2, #0288D1)',
  },
}

interface CreateRoomButtonProps {
  onRoomCreated?: (room: Room) => void
  buttonText?: string
  buttonStyle?: SxProps<Theme>
  // Можно добавить другие пропсы для кастомизации кнопки или диалога
}

export function CreateRoomButton({
  onRoomCreated,
  buttonText,
  buttonStyle,
}: CreateRoomButtonProps) {
  const { t } = useTranslation()
  const [openDialog, setOpenDialog] = useState(false)

  // Get user state from Redux store
  const user = useSelector((state: { user: UserSliceState }) => state.user)

  // Determine if the user is qualified to create a room
  const canCreateRoom =
    user && user.isAuthenticated && user.rating !== null && user.rating >= 4

  const handleOpenDialog = () => {
    // Although the button will be disabled, an extra check can be here if desired
    if (canCreateRoom) {
      setOpenDialog(true)
    }
    // If not canCreateRoom, the tooltip will already inform the user.
    // Alternatively, a Snackbar could be triggered here for a more explicit message on click attempt.
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const handleRoomSuccessfullyCreated = (room: Room) => {
    if (onRoomCreated) {
      onRoomCreated(room)
    }
    setOpenDialog(false) // Закрываем диалог после успешного создания
  }

  const effectiveButtonStyle = buttonStyle || defaultCreateButtonStyle
  const effectiveButtonText = buttonText || t('createRoomButton.createRoom')

  const qualificationMessage = t('createRoomButton.qualificationMessage')

  return (
    <>
      <Tooltip
        title={!canCreateRoom ? qualificationMessage : ''}
        componentsProps={{
          tooltip: {
            sx: {
              backgroundColor: '#ed6c02',
              color: 'white', // Ensuring good contrast
              boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.2)', // Adding a subtle shadow
              '& .MuiTooltip-arrow': {
                // Optional: style the arrow to match
                color: '#ed6c02',
              },
            },
          },
        }}
      >
        <span>
          {' '}
          {/* Wrapper for Tooltip on disabled button */}
          <Button
            variant="contained"
            onClick={handleOpenDialog}
            sx={effectiveButtonStyle}
            disabled={!canCreateRoom} // Disable button if not qualified
          >
            {effectiveButtonText}
          </Button>
        </span>
      </Tooltip>

      {/* Dialog should only be interactable if it can be opened */}
      {canCreateRoom && (
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle sx={{ pr: '48px' }}>
            <IconButton
              aria-label={t('createRoomButton.close')}
              onClick={handleCloseDialog}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {/* Передаем колбэк для обработки создания комнаты */}
            <CreateRoomForm onRoomCreated={handleRoomSuccessfullyCreated} />
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
