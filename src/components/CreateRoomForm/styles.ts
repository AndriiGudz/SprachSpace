import { SxProps, Theme } from '@mui/material'

export const containerStyle: SxProps<Theme> = {
  maxWidth: 600,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  mx: 'auto',
  gap: 2,
  p: 2,
}

export const filterItemStyle: SxProps<Theme> = {
  width: '100%',
  mb: 0,

  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#E0E0E0', // Цвет обводки в обычном состоянии
    },
  },

  // Выровнять контент select по вертикали как в RoomFilter
  '& .MuiInputBase-root': {
    height: '40px',
    fontSize: '0.875rem',
  },
  '& .MuiSelect-select': {
    paddingTop: '8.5px',
    paddingBottom: '8.5px',
  },

  // Поднять лейбл в неактивном (не shrink) состоянии, чтобы не прилипал к низу
  '& .MuiInputLabel-root:not(.MuiInputLabel-shrink)': {
    top: '-8px',
  },
}

export const createButtonStyle: SxProps<Theme> = {
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

export const loaderWrapperStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}
