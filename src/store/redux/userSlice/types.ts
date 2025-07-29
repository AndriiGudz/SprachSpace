export interface LanguageData {
  id: number
  skillLevel: string
  language: {
    id: number
    name: string
  }
  originalLanguageId?: number // для поиска названия в availableLanguages
}

export interface RoleData {
  id: number
  title: string
  authority: string
}

export interface RoomData {
  id: number
  // Добавьте другие поля комнаты по необходимости
}

export interface UserSliceState {
  id: number | null
  nickname: string | null
  name: string | null
  surname: string | null
  email: string | null
  birthdayDate: string | null
  avatar: string | null
  foto: string | null
  rating: number | null
  internalCurrency: number | null
  status: boolean
  nativeLanguages: LanguageData[]
  learningLanguages: LanguageData[]
  roles: RoleData[]
  createdRooms: RoomData[]
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  message?: string | null
  avatarDisplayUrl?: string | null
}

export interface AuthState {
  // ... existing code ...
}
