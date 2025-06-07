import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import type { UserSliceState } from './types'
import { API_ROOT_URL } from '../../../config/apiConfig'
import { validateAndRefreshTokens } from '../../../api/authApi'

// Функция для получения blob URL аватара
async function fetchAvatarBlobUrl(
  userId: number,
  accessToken: string
): Promise<string | null> {
  try {
    const response = await fetch(`${API_ROOT_URL}/users/avatar/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      return null
    }

    const imageBlob = await response.blob()
    return URL.createObjectURL(imageBlob)
  } catch (error) {
    console.error('Failed to fetch avatar:', error)
    return null
  }
}

// Асинхронный action для загрузки аватара
export const loadUserAvatar = createAsyncThunk(
  'user/loadAvatar',
  async ({ userId, accessToken }: { userId: number; accessToken: string }) => {
    return await fetchAvatarBlobUrl(userId, accessToken)
  }
)

// Асинхронный action для проверки и обновления токенов
export const validateTokens = createAsyncThunk(
  'user/validateTokens',
  async ({
    accessToken,
    refreshToken,
  }: {
    accessToken: string
    refreshToken: string
  }) => {
    return await validateAndRefreshTokens(accessToken, refreshToken)
  }
)

// Исправляем инициализацию состояния
const storedUser = localStorage.getItem('user')
let parsedUser = null
try {
  parsedUser = storedUser ? JSON.parse(storedUser) : null
} catch (error) {
  console.error('Error parsing stored user:', error)
  localStorage.removeItem('user') // Удаляем поврежденные данные
}

export const initialState: UserSliceState =
  parsedUser && parsedUser.accessToken
    ? {
        ...parsedUser,
        isAuthenticated: true, // Устанавливаем true если есть токен
        avatarDisplayUrl: null, // Обнуляем blob URL при инициализации
      }
    : {
        id: null,
        nickname: null,
        name: null,
        surname: null,
        email: null,
        birthdayDate: null,
        foto: null,
        rating: null,
        internalCurrency: null,
        status: false,
        nativeLanguages: [],
        learningLanguages: [],
        roles: [],
        createdRooms: [],
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        message: null,
        avatarDisplayUrl: null,
      }

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<
        Omit<
          UserSliceState,
          | 'accessToken'
          | 'refreshToken'
          | 'isAuthenticated'
          | 'avatarDisplayUrl'
        >
      >
    ) => {
      const {
        id,
        nickname,
        name,
        surname,
        email,
        birthdayDate,
        foto,
        rating,
        internalCurrency,
        status,
        nativeLanguages,
        learningLanguages,
        roles,
        createdRooms,
        message,
      } = action.payload

      Object.assign(state, {
        id,
        nickname,
        name,
        surname,
        email,
        birthdayDate,
        foto,
        rating,
        internalCurrency,
        status,
        nativeLanguages,
        learningLanguages,
        roles,
        createdRooms,
        message,
        isAuthenticated: true,
      })

      // Не перезаписываем токены и avatarDisplayUrl - они устанавливаются отдельно
    },
    setTokens: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) => {
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      state.isAuthenticated = true

      // Сохраняем все состояние в localStorage
      localStorage.setItem(
        'user',
        JSON.stringify({
          ...state,
          avatarDisplayUrl: null, // Не сохраняем blob URL
        })
      )
    },
    clearUser: (state) => {
      // Очищаем blob URL если он существует
      if (
        state.avatarDisplayUrl &&
        state.avatarDisplayUrl.startsWith('blob:')
      ) {
        URL.revokeObjectURL(state.avatarDisplayUrl)
      }

      // Сбрасываем к начальному состоянию
      Object.keys(state).forEach((key) => {
        delete state[key as keyof UserSliceState]
      })
      Object.assign(state, {
        id: null,
        nickname: null,
        name: null,
        surname: null,
        email: null,
        birthdayDate: null,
        foto: null,
        rating: null,
        internalCurrency: null,
        status: false,
        nativeLanguages: [],
        learningLanguages: [],
        roles: [],
        createdRooms: [],
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        message: null,
        avatarDisplayUrl: null,
      })

      localStorage.removeItem('user')
    },
    updateUser: (state, action: PayloadAction<Partial<UserSliceState>>) => {
      Object.assign(state, action.payload)

      // Если обновляется foto, очищаем старый avatarDisplayUrl
      if (action.payload.foto !== undefined) {
        if (
          state.avatarDisplayUrl &&
          state.avatarDisplayUrl.startsWith('blob:')
        ) {
          URL.revokeObjectURL(state.avatarDisplayUrl)
        }
        state.avatarDisplayUrl = null
      }

      // Сохраняем обновленное состояние в localStorage
      localStorage.setItem(
        'user',
        JSON.stringify({
          ...state,
          avatarDisplayUrl: null, // Не сохраняем blob URL
        })
      )
    },
    setAvatarDisplayUrl: (state, action: PayloadAction<string | null>) => {
      if (
        state.avatarDisplayUrl &&
        state.avatarDisplayUrl.startsWith('blob:')
      ) {
        URL.revokeObjectURL(state.avatarDisplayUrl)
      }
      state.avatarDisplayUrl = action.payload
    },
    logoutUser: (state) => {
      // Очищаем blob URL если он существует
      if (
        state.avatarDisplayUrl &&
        state.avatarDisplayUrl.startsWith('blob:')
      ) {
        URL.revokeObjectURL(state.avatarDisplayUrl)
      }

      // Полностью очищаем состояние
      Object.keys(state).forEach((key) => {
        delete state[key as keyof UserSliceState]
      })
      Object.assign(state, {
        id: null,
        nickname: null,
        name: null,
        surname: null,
        email: null,
        birthdayDate: null,
        foto: null,
        rating: null,
        internalCurrency: null,
        status: false,
        nativeLanguages: [],
        learningLanguages: [],
        roles: [],
        createdRooms: [],
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        message: null,
        avatarDisplayUrl: null,
      })

      localStorage.removeItem('user')
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUserAvatar.fulfilled, (state, action) => {
        // Очищаем старый blob URL если он есть
        if (
          state.avatarDisplayUrl &&
          state.avatarDisplayUrl.startsWith('blob:')
        ) {
          URL.revokeObjectURL(state.avatarDisplayUrl)
        }
        state.avatarDisplayUrl = action.payload
      })
      .addCase(validateTokens.fulfilled, (state, action) => {
        if (action.payload) {
          // Обновляем токены
          state.accessToken = action.payload.accessToken
          state.refreshToken = action.payload.refreshToken
          state.isAuthenticated = true

          // Сохраняем обновленные токены в localStorage
          localStorage.setItem(
            'user',
            JSON.stringify({
              ...state,
              avatarDisplayUrl: null, // Не сохраняем blob URL
            })
          )
        } else {
          // Токены невалидны - разлогиниваем пользователя
          if (
            state.avatarDisplayUrl &&
            state.avatarDisplayUrl.startsWith('blob:')
          ) {
            URL.revokeObjectURL(state.avatarDisplayUrl)
          }

          Object.keys(state).forEach((key) => {
            delete state[key as keyof UserSliceState]
          })
          Object.assign(state, {
            id: null,
            nickname: null,
            name: null,
            surname: null,
            email: null,
            birthdayDate: null,
            foto: null,
            rating: null,
            internalCurrency: null,
            status: false,
            nativeLanguages: [],
            learningLanguages: [],
            roles: [],
            createdRooms: [],
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            message: null,
            avatarDisplayUrl: null,
          })

          localStorage.removeItem('user')
        }
      })
  },
})

export const {
  setUser,
  setTokens,
  clearUser,
  updateUser,
  setAvatarDisplayUrl,
  logoutUser,
} = userSlice.actions
export default userSlice.reducer
