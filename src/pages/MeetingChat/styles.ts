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
  display: 'grid',
  gridTemplateColumns: {
    xs: '1fr',
    md: 'repeat(auto-fit, minmax(280px, 1fr))',
  },
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
  borderRadius: 3,
  overflow: 'hidden',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
  background: 'linear-gradient(145deg, #f5f7fa 0%, #c3cfe2 100%)',
}
