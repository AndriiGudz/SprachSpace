import { SxProps, Theme } from '@mui/material'

export const containerStyle: SxProps<Theme> = {
  py: 4,
}

export const boxTitleStyle: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
  alignItems: 'center',
  py: 2,
  px: 2,
}

export const meetingCardStyle: SxProps<Theme> = {
  width: '100%',
  maxWidth: '1200px',
  mx: 'auto',
  px: 2,
}

export const filterButtonsStyle: SxProps<Theme> = {
  display: 'flex',
  alignItems: { xs: 'center' },
  height: { xs: '72px' },
  flexWrap: 'nowrap',
  gap: 1,
  justifyContent: { xs: 'flex-start', sm: 'center' },
  mb: 3,
  px: 2,
  overflowX: 'auto',
  overflowY: 'hidden',
  scrollbarWidth: 'none', // Firefox
  '&::-webkit-scrollbar': {
    display: 'none', // Chrome, Safari
  },
  touchAction: 'pan-x',
  '-webkit-overflow-scrolling': 'touch',
  // Добавляем отступы с боков для мобильных устройств
  '& > *': {
    flexShrink: 0,
  },
}
