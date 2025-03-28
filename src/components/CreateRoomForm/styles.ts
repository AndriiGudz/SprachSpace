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
