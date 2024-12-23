import { Button } from '@mui/material'

interface ButtonProps {
  text: string
  onClick?: () => void
}

function ButtonMUI({ text, onClick }: ButtonProps) {
  return (
    <Button
      variant="contained"
      color="warning"
      sx={{ alignSelf: 'flex-start', backgroundColor: '#FF9800' }}
      size="large"
      onClick={onClick}
      type="button"
    >
      {text}
    </Button>
  )
}

export default ButtonMUI
