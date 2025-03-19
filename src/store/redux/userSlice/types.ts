export interface LanguageData {
  id: number
  skillLevel: string
  language: {
    id: number
    name: string
  }
}

export interface UserSlaceState {
  id: string | null
  nickname: string | null
  name: string | null
  surname: string | null
  email: string | null
  backupEmail?: string | null
  birthdayDate: string | null
  nativeLanguages: LanguageData[]
  learningLanguages: LanguageData[]
  rating: string | null
  internalCurrency: string | null
  status: boolean
  avatar?: string | null;
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
}
