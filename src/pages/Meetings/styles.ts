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