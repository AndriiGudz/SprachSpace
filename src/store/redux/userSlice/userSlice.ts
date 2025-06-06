import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import type { UserSliceState } from './types'
import { API_ROOT_URL } from '../../../config/apiConfig'

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

const storedUser = localStorage.getItem('user')
export const initialState: UserSliceState = storedUser
  ? JSON.parse(storedUser)
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
        Omit<UserSliceState, 'accessToken' | 'refreshToken' | 'isAuthenticated'>
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

      // avatarDisplayUrl будет установлен отдельно через loadUserAvatar

      localStorage.setItem('user', JSON.stringify(state))
    },
    setTokens: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) => {
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      localStorage.setItem('user', JSON.stringify(state))
    },
    clearUser: (state) => {
      // Очищаем blob URL если он существует
      if (
        state.avatarDisplayUrl &&
        state.avatarDisplayUrl.startsWith('blob:')
      ) {
        URL.revokeObjectURL(state.avatarDisplayUrl)
      }

      Object.assign(state, initialState)
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
        // Новый avatarDisplayUrl будет установлен отдельно через loadUserAvatar
      }

      localStorage.setItem('user', JSON.stringify(state))
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

      Object.assign(state, initialState)
      localStorage.removeItem('user')
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadUserAvatar.fulfilled, (state, action) => {
      // Очищаем старый blob URL если он есть
      if (
        state.avatarDisplayUrl &&
        state.avatarDisplayUrl.startsWith('blob:')
      ) {
        URL.revokeObjectURL(state.avatarDisplayUrl)
      }
      state.avatarDisplayUrl = action.payload
    })
  },
})

export const {
  setUser,
  setTokens,
  clearUser,
  updateUser,
  setAvatarDisplayUrl,
} = userSlice.actions
export default userSlice.reducer
