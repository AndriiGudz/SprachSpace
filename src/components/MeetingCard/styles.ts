import { SxProps, Theme } from '@mui/material'
import bgPhoto from '../../assets/meetingCard.webp'

// Основной стиль карточки (MeetingCard)
export const cardStyle: SxProps<Theme> = {
  maxWidth: '1200px',
  width: '100%',
  margin: 'auto',
  position: 'relative',
  background: `
      linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), 
      url(${bgPhoto}) center / cover no-repeat
    `,

  '&:hover': {
    boxShadow: '0px 0px 24px 0px rgba(0, 0, 0, 0.25)',
  },
}

// Стиль для контейнера контента (CardContent)
export const cardContentStyle: SxProps<Theme> = {
  position: 'relative', // Обеспечивает корректное наложение поверх фонового изображения
  p: '24px',
  zIndex: 1, // Контент выводится выше фонового изображения
}

// ================================
// Верхняя часть карточки (заголовок и категория)
// ================================
// Данный стиль применяется к контейнеру, в котором находятся заголовок и категория встречи.
// Обратите внимание, что для адаптивности flexDirection можно менять динамически (например, 'column' для мобильных устройств).
export const topSectionBoxStyle: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'flex-start',
  mb: 4, // Отступ снизу
  // flexDirection: 'row' или 'column' — задайте динамически в компоненте, если нужно
  gap: { xs: 2, md: 4 }, // Расстояние между блоками
}

// ================================
// Блок с информацией о времени и участниках
// ================================
// Стиль для контейнеров, в которых отображаются время встречи, количество участников и др.
// Также можно динамически менять flexDirection, если требуется.
export const infoBoxStyle: SxProps<Theme> = {
  display: 'flex',
  gap: { xs: 2, md: 4 }, // Расстояние между информационными блоками
  // flexDirection: 'row' или 'column' — настройте динамически в компоненте
}

// Стиль для контейнеро с информацией
export const participantBoxStyle: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
}

// ================================
// Нижняя часть карточки (язык, аватар, действия)
// ================================
// Стиль для контейнера нижней части карточки, где расположены информация о языке, аватар и кнопки действий.
export const bottomSectionStyle: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  mt: 2,
  gap: { xs: 2, md: 4 },
}

// Контейнер для языка и иконки флага
export const languageContainerStyle: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: { xs: 2, md: 4 },
}

// Стиль для ограничения по возрасту (если задано)
export const ageRestrictionStyle: SxProps<Theme> = {
  bgcolor: 'error.main',
  color: 'white',
  p: 1,
  borderRadius: 1,
}

// Контейнер для кнопок действий (поделиться, копировать, присоединиться)
export const actionButtonsStyle: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
}

// Стиль для кнопки "Join", добавляющий отступ слева
export const joinButtonStyle: SxProps<Theme> = {
  display: 'flex',
  padding: '10px 24px',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '10px',
  borderRadius: '10px',
  background: 'var(--light-blue-darken-1, #039BE5)',
  textTransform: 'none',

  '&:hover': {
    background: 'var(--light-blue-darken-2, #0288D1)',
  },
}

export const privacyLabelStyle: SxProps<Theme> = {
  position: 'absolute',
  top: 16,
  right: 16,
  borderRadius: '16px',
  px: 2,
  py: 0.5,
  fontSize: '0.875rem',
  fontWeight: 500,
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  zIndex: 1,
  backdropFilter: 'blur(8px)',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
  },
  '&.private': {
    backgroundColor: 'rgba(211, 47, 47, 0.1)',
    color: '#d32f2f',
    border: '1px solid rgba(211, 47, 47, 0.2)',
  },
  '&.public': {
    backgroundColor: 'rgba(46, 125, 50, 0.1)',
    color: '#2e7d32',
    border: '1px solid rgba(46, 125, 50, 0.2)',
  },
}
