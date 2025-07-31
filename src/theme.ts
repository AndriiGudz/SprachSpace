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
    h2: {
      fontSize: '32px',
      fontWeight: 700,
      lineHeight: '100%',
      letterSpacing: '0.64px',
    },
    h3: {
      fontSize: '24px',
      fontWeight: 700,
      lineHeight: '100%',
      letterSpacing: '0.48px',
    },
    h4: {
      fontSize: '20px',
      fontWeight: 600,
      lineHeight: '100%',
      letterSpacing: '0.4px',
    },
    body1: {
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: '100%',
      letterSpacing: '0.32px',
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
          borderRadius: '4px',
          '&.inputPrimary .MuiOutlinedInput-root': {
            backgroundColor: '#eee', // Основной цвет фона
          },
          '&.inputSecondary .MuiOutlinedInput-root': {
            backgroundColor: '#E1F5FE', // Альтернативный цвет фона
          },
          '&.inputGrey .MuiOutlinedInput-root': {
            backgroundColor: '#EEE',
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          marginTop: 0, // Убираем верхний отступ
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
          '&.inputGrey .MuiOutlinedInput-notchedOutline': {
            borderColor: '#E0E0E0', // Цвет рамки для класса inputGrey
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
          color: '#212121',
          '&.Mui-focused': {
            color: '#01579B',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          '&.MuiInputLabel-outlined': {
            top: '-8px',
            transition: 'all 0.2s ease',
            '&.MuiInputLabel-shrink': {
              top: '0px',
              transform: 'translate(14px, -9px) scale(0.75)',
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          // Убираем кастомные стили padding
        },
      },
    },
  },
})

export default theme
