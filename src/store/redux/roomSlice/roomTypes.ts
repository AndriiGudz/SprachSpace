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
  // Дополнительно: некоторые ответы могут содержать только имя категории
  categoryName?: string
  privateRoom: boolean // New
  languageLvl: string | null // New
  quantityParticipant: number // Количество участников ожидающих встречу
  status: boolean
  age: number
  language: string
  minQuantity: number
  maxQuantity: number
  roomUrl: string
  participants?: RoomParticipant[] // Обновленный тип для participants
  creator?: ApiCreator // Optional, as per API response, now typed
  roomOnlineUsers?: Array<{
    id: number
    nickname: string | null
    name: string | null
    email: string | null
    surname: string | null
    avatar: string | null
    rating: number
    [key: string]: any
  }>
  countOnlineUser?: number
  // userId: string; // ID пользователя, создавшего комнату
  // category?: string; // Категория может быть не основным полем API
  // proficiency?: string; // Уровень владения может быть не основным полем API
}

export interface ApiCreator {
  id: number
  nickname: string | null
  name: string | null
  surname: string | null
  email: string
  avatar: string | null
  rating: number
  password: string
  birthdayDate: string | null
  internalCurrency: string | null
  status: boolean
  nativeLanguages: any[]
  learningLanguages: any[]
  roles: any[]
  createdRooms: any[]
  enabled: boolean
  username: string
  authorities: any[]
  credentialsNonExpired: boolean
  accountNonExpired: boolean
  accountNonLocked: boolean
}

// Тип для данных, отправляемых при создании комнаты (совпадает с CreateRoomRequest из CreateRoomForm)
export interface CreateRoomApiRequest {
  topic: string
  startTime: string // ISO string
  endTime: string // ISO string
  status: boolean
  age: number // Required field - if not set by user, defaults to 0
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
  userParticipations: Record<number, RoomParticipant> // roomId -> participant data
  // Карта статусов участия пользователя по id комнаты
  roomStatuses?: Record<
    number,
    {
      status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'DECLINED'
      type:
        | 'REQUESTED_BY_USER'
        | 'INVITED_BY_ORGANIZER'
        | 'CREATOR'
        | 'INVITED_BY_CREATOR'
        | 'VISITED_WITHOUT_AN_INVITATION'
        | string
    }
  >
}

// Можно добавить тип для пользователя, если он будет использоваться в участниках
// export interface User {
//   id: string;
//   name: string;
//   // ... другие поля пользователя
// }

// Новые типы для заявок на присоединение
export interface ParticipantLanguage {
  id: number
  language: {
    id: number
    name: string
  }
  skillLevel: string
}

export interface ParticipantRole {
  id: number
  title: string
  authority: string
}

export interface ParticipantUser {
  id: number
  nickname: string | null
  name: string | null
  email: string
  surname: string | null
  password: string
  birthdayDate: string | null
  avatar: string | null
  rating: number
  internalCurrency: string | null
  status: boolean
  nativeLanguages: ParticipantLanguage[]
  learningLanguages: ParticipantLanguage[]
  roles: ParticipantRole[]
  createdRooms: any[]
  enabled: boolean
  authorities: any[]
  username: string
  accountNonLocked: boolean
  accountNonExpired: boolean
  credentialsNonExpired: boolean
}

export interface RoomParticipant {
  id: number // participantId
  user: ParticipantUser
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'VIEWED'
  participantType:
    | 'REQUESTED_BY_USER'
    | 'INVITED_BY_ORGANIZER'
    | 'CREATOR'
    | 'INVITED_BY_CREATOR'
    | 'VISITED_WITHOUT_AN_INVITATION'
}

// Ответ эндпоинта /api/room/roomStatus?userId=...
export interface RoomStatusItem {
  room: Partial<ApiRoom> & { category?: any }
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'REJECTED'
  type:
    | 'REQUESTED_BY_USER'
    | 'INVITED_BY_ORGANIZER'
    | 'CREATOR'
    | 'INVITED_BY_CREATOR'
    | 'VISITED_WITHOUT_AN_INVITATION'
    | string
}
