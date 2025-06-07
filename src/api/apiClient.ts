import { API_ROOT_URL } from '../config/apiConfig'
import { validateAndRefreshTokens } from './authApi'

// Тип для конфигурации запроса
interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: BodyInit
  requireAuth?: boolean
}

// Функция для получения токенов из localStorage
function getTokensFromStorage() {
  try {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      return {
        accessToken: userData.accessToken,
        refreshToken: userData.refreshToken,
      }
    }
  } catch (error) {
    console.error('Error parsing tokens from storage:', error)
  }
  return { accessToken: null, refreshToken: null }
}

// Функция для обновления токенов в localStorage
function updateTokensInStorage(tokens: {
  accessToken: string
  refreshToken: string
}) {
  try {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      userData.accessToken = tokens.accessToken
      userData.refreshToken = tokens.refreshToken
      localStorage.setItem('user', JSON.stringify(userData))
    }
  } catch (error) {
    console.error('Error updating tokens in storage:', error)
  }
}

// Основная функция для выполнения HTTP запросов с автоматическим управлением токенами
export async function apiRequest(
  url: string,
  config: RequestConfig = {}
): Promise<Response> {
  const { method = 'GET', headers = {}, body, requireAuth = true } = config

  let requestHeaders: Record<string, string> = { ...headers }

  // Если требуется авторизация, добавляем токен
  if (requireAuth) {
    const { accessToken, refreshToken } = getTokensFromStorage()

    if (accessToken && refreshToken) {
      // Проверяем и обновляем токены при необходимости
      const validTokens = await validateAndRefreshTokens(
        accessToken,
        refreshToken
      )

      if (validTokens) {
        // Если токены были обновлены, сохраняем их
        if (validTokens.accessToken !== accessToken) {
          updateTokensInStorage(validTokens)
        }

        requestHeaders = {
          ...requestHeaders,
          Authorization: `Bearer ${validTokens.accessToken}`,
        }
      } else {
        // Токены невалидны - очищаем localStorage и перенаправляем на вход
        localStorage.removeItem('user')
        // Можно добавить dispatch для очистки Redux состояния
        throw new Error('Authentication required')
      }
    } else if (requireAuth) {
      throw new Error('Authentication required')
    }
  }

  // Добавляем Content-Type для POST/PUT запросов если не указан
  if (
    (method === 'POST' || method === 'PUT' || method === 'PATCH') &&
    body &&
    !requestHeaders['Content-Type']
  ) {
    requestHeaders['Content-Type'] = 'application/json'
  }

  const fullUrl = url.startsWith('http') ? url : `${API_ROOT_URL}${url}`

  const response = await fetch(fullUrl, {
    method,
    headers: requestHeaders,
    body,
  })

  // Если получили 401, пытаемся обновить токены и повторить запрос
  if (response.status === 401 && requireAuth) {
    const { accessToken, refreshToken } = getTokensFromStorage()

    if (accessToken && refreshToken) {
      const validTokens = await validateAndRefreshTokens(
        accessToken,
        refreshToken
      )

      if (validTokens) {
        updateTokensInStorage(validTokens)

        // Повторяем запрос с новым токеном
        const retryHeaders: Record<string, string> = {
          ...requestHeaders,
          Authorization: `Bearer ${validTokens.accessToken}`,
        }

        return fetch(fullUrl, {
          method,
          headers: retryHeaders,
          body,
        })
      } else {
        // Токены невалидны - очищаем localStorage
        localStorage.removeItem('user')
        throw new Error('Authentication failed')
      }
    }
  }

  return response
}

// Вспомогательные функции для разных типов запросов
export const api = {
  get: (url: string, requireAuth = true) =>
    apiRequest(url, { method: 'GET', requireAuth }),

  post: (url: string, data: any, requireAuth = true) =>
    apiRequest(url, {
      method: 'POST',
      body: JSON.stringify(data),
      requireAuth,
    }),

  put: (url: string, data: any, requireAuth = true) =>
    apiRequest(url, {
      method: 'PUT',
      body: JSON.stringify(data),
      requireAuth,
    }),

  delete: (url: string, requireAuth = true) =>
    apiRequest(url, { method: 'DELETE', requireAuth }),

  patch: (url: string, data: any, requireAuth = true) =>
    apiRequest(url, {
      method: 'PATCH',
      body: JSON.stringify(data),
      requireAuth,
    }),
}
