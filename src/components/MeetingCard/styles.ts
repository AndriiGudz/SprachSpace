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
  }
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
  alignItems: 'center', // Вертикальное центрирование элементов
  justifyContent: 'space-between', // Размещение элементов по краям контейнера
  mt: 2, // Отступ сверху
  gap: { xs: 2, md: 4 }, // для телефонов gap = 2, для больших экранов = 4
}

// Контейнер для языка и иконки флага
export const languageContainerStyle: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: { xs: 2, md: 4 }, // Расстояние между иконкой и текстом языка
}

// Стиль для ограничения по возрасту (если задано)
export const ageRestrictionStyle: SxProps<Theme> = {
  bgcolor: 'error.main', // Цвет фона в соответствии с темой (например, для ошибки или предупреждения)
  color: 'white', // Цвет текста
  p: 1, // Горизонтальные отступы
  borderRadius: 1, // Скругление углов
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
