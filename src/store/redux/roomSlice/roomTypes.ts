export interface ApiRoomCategory {
  id: number
  name: string
}

export interface ApiRoom {
  id: number // Changed from string to number
  topic: string
  startTime: string // ISO Date string
  endTime: string // ISO Date string
  duration?: number // New, from API response (e.g., 50 minutes)
  category: ApiRoomCategory // Changed from string to object
  privateRoom: boolean // New
  languageLvl: string | null // New
  status: boolean
  age: number
  language: string
  minQuantity: number
  maxQuantity: number
  roomUrl: string
  participants?: any[] // Optional, as per API response
  creator?: ApiCreator // Optional, as per API response, now typed
  // userId: string; // ID пользователя, создавшего комнату
  // category?: string; // Категория может быть не основным полем API
  // proficiency?: string; // Уровень владения может быть не основным полем API
}

export interface ApiCreator {
  id: number // Из JSON видно, что это number
  nickname: string
  name: string // Это firstName из JSON
  surname: string // lastName из JSON
  foto: string // Это avatarUrl из JSON, может быть пустой строкой
  rating: number // Из JSON видно, что это number
  // Остальные поля из JSON (email, password, birthdayDate и т.д.) пока не добавляем,
  // так как они не нужны для MeetingCard. При необходимости можно будет добавить.
}

// Тип для данных, отправляемых при создании комнаты (совпадает с CreateRoomRequest из CreateRoomForm)
export interface CreateRoomApiRequest {
  topic: string
  startTime: string // ISO string
  endTime: string // ISO string
  status: boolean
  age?: number // Optional, API shows 0, form might send null/undefined
  language: string
  languageLvl: string // New: maps from UI's proficiency
  category: string // API expects string for creation as per example
  privateRoom: boolean // New
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
