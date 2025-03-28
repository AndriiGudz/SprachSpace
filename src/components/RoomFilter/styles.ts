import { SxProps, Theme } from '@mui/material'

export const containerStyle: SxProps<Theme> = {
  width: '100%',
  backgroundColor: '#fff',
  py: 4,
  boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
}

export const filterBoxStyle: SxProps<Theme> = {
  display: 'flex',
  maxWidth: '1200px',
  mx: 'auto',
  px: 2,
}

export const filterItemStyle: SxProps<Theme> = {
  width: '170px',
  marginBottom: '0',

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
