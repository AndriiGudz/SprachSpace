export interface UserSlaceState {
  id: string | null
  nickname: string | null
  name: string | null
  surname: string | null
  email: string | null
  birthdayDate: string | null
  nativeLanguage: string | null
  learningLanguage: string | null
  skillLevel: string | null
  rating: string | null
  internalCurrency: string | null
  status: boolean
  avatar?: string | null;
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
}
