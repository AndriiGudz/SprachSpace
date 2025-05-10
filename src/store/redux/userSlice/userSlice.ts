import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { UserSliceState } from './types'

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
      Object.assign(state, initialState)
      localStorage.removeItem('user')
    },
    updateUser: (state, action: PayloadAction<Partial<UserSliceState>>) => {
      Object.assign(state, action.payload)
      localStorage.setItem('user', JSON.stringify(state))
    },
  },
})

export const { setUser, setTokens, clearUser, updateUser } = userSlice.actions
export default userSlice.reducer
