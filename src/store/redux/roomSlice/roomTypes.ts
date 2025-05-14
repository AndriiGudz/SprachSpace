export interface ApiRoom {
  id: string
  topic: string
  startTime: string // ISO Date string
  endTime: string // ISO Date string
  status: boolean
  age: number
  language: string
  minQuantity: number
  maxQuantity: number
  roomUrl: string
  // userId: string; // ID пользователя, создавшего комнату
  // participants: User[]; // Массив участников, если API его возвращает
  // category?: string; // Категория может быть не основным полем API
  // proficiency?: string; // Уровень владения может быть не основным полем API
}

// Тип для данных, отправляемых при создании комнаты (совпадает с CreateRoomRequest из CreateRoomForm)
export interface CreateRoomApiRequest {
  topic: string
  startTime: string // ISO string
  endTime: string // ISO string
  status: boolean
  age: number
  language: string
  minQuantity: number
  maxQuantity: number
  // category?: string; // Если это часть запроса на создание
  // proficiency?: string; // Если это часть запроса на создание
}

export interface RoomSliceState {
  rooms: ApiRoom[]
  activeRoom: ApiRoom | null
  isLoading: boolean // Замена 'status' для простоты
  error: string | null | undefined // Сохраняем сообщение об ошибке
}

// Можно добавить тип для пользователя, если он будет использоваться в участниках
// export interface User {
//   id: string;
//   name: string;
//   // ... другие поля пользователя
// }
