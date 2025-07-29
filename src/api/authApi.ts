import { API_ROOT_URL } from '../config/apiConfig'
import { LanguageData } from '../store/redux/userSlice/types'

export interface TokenResponse {
  accessToken: string
  refreshToken: string
}

export interface LoginResponse extends TokenResponse {
  id: number
  nickname: string
  name: string
  surname: string
  email: string
  birthdayDate: string
  avatar: string
  rating: number
  internalCurrency: number
  status: boolean
  nativeLanguages: LanguageData[]
  learningLanguages: LanguageData[]
  roles: any[]
  createdRooms: any[]
  message?: string
}

// Функция для обновления токенов
export async function refreshTokens(
  refreshToken: string
): Promise<TokenResponse> {
  const response = await fetch(`${API_ROOT_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  })

  if (!response.ok) {
    throw new Error('Failed to refresh tokens')
  }

  return response.json()
}

// Функция для проверки валидности токена
export function isTokenExpired(token: string): boolean {
  if (!token) return true

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const currentTime = Date.now() / 1000
    return payload.exp < currentTime
  } catch {
    return true
  }
}

// Функция для проверки и обновления токенов при необходимости
export async function validateAndRefreshTokens(
  accessToken: string | null,
  refreshToken: string | null
): Promise<TokenResponse | null> {
  if (!accessToken || !refreshToken) return null

  // Если access token еще валиден, возвращаем текущие токены
  if (!isTokenExpired(accessToken)) {
    return { accessToken, refreshToken }
  }

  // Если refresh token тоже истек, возвращаем null
  if (isTokenExpired(refreshToken)) {
    return null
  }

  try {
    return await refreshTokens(refreshToken)
  } catch (error) {
    console.error('Failed to refresh tokens:', error)
    return null
  }
}
