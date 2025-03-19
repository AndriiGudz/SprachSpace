import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { UserSlaceState } from './types'

const storedUser = localStorage.getItem('user');
export const initialState: UserSlaceState = storedUser
  ? JSON.parse(storedUser)
  : {
      id: null,
      nickname: null,
      name: null,
      surname: null,
      email: null,
      backupEmail: null,
      birthdayDate: null,
      nativeLanguages: [],
      learningLanguages: [],
      rating: null,
      internalCurrency: null,
      status: false,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      avatar: null,
    };


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

      // Присваиваем поля
      state.id = action.payload.id
      state.nickname = action.payload.nickname
      state.name = action.payload.name
      state.surname = action.payload.surname
      state.email = action.payload.email
      state.birthdayDate = action.payload.birthdayDate
      state.nativeLanguages = action.payload.nativeLanguages
      state.learningLanguages = action.payload.learningLanguages
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
    
      Object.assign(state, {
        id: null,
        nickname: null,
        name: null,
        surname: null,
        email: null,
        backupEmail: null,
        birthdayDate: null,
        nativeLanguages: [],
        learningLanguages: [],
        rating: null,
        internalCurrency: null,
        status: false,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        avatar: null,
      });
    
    },
    updateUser: (
      state,
      action: PayloadAction<Partial<UserSlaceState>>
    ) => {

      Object.assign(state, action.payload)

      // Сохраняем обновлённое состояние в localStorage
      localStorage.setItem('user', JSON.stringify(state))
    },
  },
})

export const { setUser, setTokens, clearUser, updateUser } = userSlice.actions
export default userSlice.reducer