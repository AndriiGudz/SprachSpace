import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  typography: {
    fontFamily: 'Oswald, sans-serif',
    allVariants: {
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: '100%',
      letterSpacing: '0.32px',
    },
    h1: {
      fontSize: '48px',
      fontWeight: 700,
      lineHeight: '100%',
      letterSpacing: '0.96px',
    },
  },
  palette: {
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
    primary: {
      main: '#01579B',
    },
    secondary: {
      main: '#0280c7',
    },
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        margin: 'none', // Убираем стандартные отступы
      },
      styleOverrides: {
        root: {
          marginBottom: '16px',
          '&.inputPrimary .MuiOutlinedInput-root': {
            backgroundColor: '#eee', // Основной цвет фона
          },
          '&.inputSecondary .MuiOutlinedInput-root': {
            backgroundColor: '#E1F5FE', // Альтернативный цвет фона
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          marginTop: 0,   // Убираем верхний отступ
          marginBottom: 0, // Убираем нижний отступ
        },
      },
    },
    MuiOutlinedInput: {
        styleOverrides: {
          root: {
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#01579B', // Стиль для ховера
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#01579B', // Стиль для фокуса
            },
          },
          input: {
            fontFamily: 'Oswald, sans-serif',
            fontSize: '16px',
          },
          notchedOutline: {
            borderWidth: '1px', // Ширина рамки
            borderColor: '#fff', // Цвет рамки по умолчанию
          },
        },
      },      
    MuiFormLabel: {
      styleOverrides: {
        root: {
          display: 'flex',
          alignItems: 'center',
          color: '#212121',
          '&.Mui-focused': {
            color: '#01579B',
          },
        },
      },
    },
  },
})

export default theme