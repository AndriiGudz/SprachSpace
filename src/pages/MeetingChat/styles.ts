import { SxProps, Theme } from '@mui/material'

export const containerStyle: SxProps<Theme> = {
  maxWidth: '1200px',
  mx: 'auto',
  px: { xs: 2, sm: 3 },
  py: { xs: 2, sm: 4 },
}

export const headerStyle: SxProps<Theme> = {
  mb: 4,
}

export const meetingInfoStyle: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' },
  gap: 3,
  mb: 4,
}

export const chatContainerStyle: SxProps<Theme> = {
  height: 'calc(100vh - 200px)',
  minHeight: '500px',
}

export const videoAreaStyle: SxProps<Theme> = {
  width: '100%',
  height: '100%',
  bgcolor: 'background.paper',
  borderRadius: 1,
  overflow: 'hidden',
  boxShadow: 1,
}
