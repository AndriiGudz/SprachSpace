import { SxProps, Theme } from '@mui/material'

export const containerStyle = {
  py: 2,
  backgroundColor: 'white',
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
  borderRadius: '8px',
}

export const filterBoxStyle: SxProps<Theme> = {
  display: 'flex',
  maxWidth: '1200px',
  mx: 'auto',
  px: 2,
}

export const filterItemStyle = {
  display: 'flex',
  minWidth: 120,
  flex: '1 1 auto',
  '& .MuiInputBase-root': {
    height: '40px',
    fontSize: '0.875rem',
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.875rem',
    transform: 'translate(14px, 10px) scale(1)',
  },
  '& .MuiInputLabel-shrink': {
    transform: 'translate(14px, -9px) scale(0.75)',
  },
  '& .MuiSelect-select': {
    paddingTop: '8.5px',
    paddingBottom: '8.5px',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#E0E0E0',
  },
}
