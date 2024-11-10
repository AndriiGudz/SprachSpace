import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { UserSlaceState } from './types'

const initialState: UserSlaceState = {
  id: null,
  nickname: null,
  name: null,
  surname: null,
  email: null,
  birthdayDate: null,
  nativeLanguage: null,
  learningLanguage: null,
  skillLevel: null,
  rating: null,
  internalCurrency: null,
  status: false,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  avatar: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<
        Omit<UserSlaceState, 'accessToken' | 'refreshToken' | 'isAuthenticated'>
      >
    ) => {
      state.id = action.payload.id
      state.nickname = action.payload.nickname
      state.name = action.payload.name
      state.surname = action.payload.surname
      state.email = action.payload.email
      state.birthdayDate = action.payload.birthdayDate
      state.nativeLanguage = action.payload.nativeLanguage
      state.learningLanguage = action.payload.learningLanguage
      state.skillLevel = action.payload.skillLevel
      state.rating = action.payload.rating
      state.internalCurrency = action.payload.internalCurrency
      state.status = action.payload.status
      state.isAuthenticated = true
    },
    setTokens: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) => {
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
    },
    clearUser: (state) => {
      Object.assign(state, initialState)
    },
  },
})

export const { setUser, setTokens, clearUser } = userSlice.actions
export default userSlice.reducer
