import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import {
  ApiRoom,
  CreateRoomApiRequest,
  RoomSliceState,
  RoomParticipant,
} from './roomTypes'
import type { RootState } from '../../store' // Предполагаем, что store.ts находится в ../../store

// Импорт для обработки действий пользователя
// NOTE: Будет добавлен динамически для избежания циклических зависимостей

const initialState: RoomSliceState = {
  rooms: [],
  activeRoom: null,
  isLoading: false,
  error: null,
  userParticipations: {},
}

// Async Thunk для создания комнаты
export const createRoom = createAsyncThunk<
  ApiRoom, // Тип возвращаемого значения при успехе
  { roomData: CreateRoomApiRequest; userId: string }, // Тип аргумента thunk
  { rejectValue: string; state: RootState } // Тип для rejectValue и getState
>('rooms/createRoom', async ({ roomData, userId }, { rejectWithValue }) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/room?userId=${userId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roomData),
      }
    )
    if (!response.ok) {
      const errorData = await response.json()
      return rejectWithValue(errorData.message || 'Failed to create room')
    }
    const createdRoom: ApiRoom = await response.json()
    return createdRoom
  } catch (error: any) {
    return rejectWithValue(error.message || 'An unknown error occurred')
  }
})

// Async Thunk для получения списка комнат
export const fetchRooms = createAsyncThunk<
  ApiRoom[], // Тип возвращаемого значения
  void, // Тип аргумента (void, если нет аргументов)
  { rejectValue: string } // Тип для rejectValue
>('rooms/fetchRooms', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch('http://localhost:8080/api/room/allRoom')
    if (!response.ok) {
      const errorData = await response.json()
      return rejectWithValue(errorData.message || 'Failed to fetch rooms')
    }
    const rooms: ApiRoom[] = await response.json()
    return rooms
  } catch (error: any) {
    return rejectWithValue(
      error.message || 'An unknown error occurred during fetch'
    )
  }
})

// Новый async thunk для отправки заявки на присоединение
export const sendJoinRequest = createAsyncThunk<
  { roomId: number; participant: RoomParticipant },
  { roomId: number; userId: number },
  { rejectValue: string; state: RootState }
>('rooms/sendJoinRequest', async ({ roomId, userId }, { rejectWithValue }) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/room/participant/invite/sendInvitation?userId=${userId}&roomId=${roomId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (response.ok) {
      const participant: RoomParticipant = await response.json()
      return { roomId, participant }
    } else if (response.status === 409) {
      // 409 Conflict означает что приглашение уже отправлено - получаем данные
      const participant: RoomParticipant = await response.json()
      return { roomId, participant }
    } else {
      return rejectWithValue('Failed to send join request')
    }
  } catch (error: any) {
    return rejectWithValue(error.message || 'Unknown error occurred')
  }
})

// Async thunk для получения встреч пользователя
export const fetchUserMeetings = createAsyncThunk<
  { createdRooms: ApiRoom[]; joinedRooms: ApiRoom[] },
  number, // userId
  { rejectValue: string }
>('rooms/fetchUserMeetings', async (userId, { rejectWithValue }) => {
  try {
    // Получаем созданные пользователем комнаты
    const createdResponse = await fetch(
      `http://localhost:8080/api/room/user/${userId}/created`
    )
    // Получаем комнаты к которым присоединился пользователь
    const joinedResponse = await fetch(
      `http://localhost:8080/api/room/user/${userId}/joined`
    )

    if (!createdResponse.ok && !joinedResponse.ok) {
      return rejectWithValue('Failed to fetch user meetings')
    }

    const createdRooms: ApiRoom[] = createdResponse.ok
      ? await createdResponse.json()
      : []
    const joinedRooms: ApiRoom[] = joinedResponse.ok
      ? await joinedResponse.json()
      : []

    return { createdRooms, joinedRooms }
  } catch (error: any) {
    return rejectWithValue(error.message || 'Unknown error occurred')
  }
})

const roomSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    setActiveRoom: (state, action: PayloadAction<ApiRoom | null>) => {
      state.activeRoom = action.payload
    },
    clearRoomError: (state) => {
      state.error = null
    },
    // Новые редьюсеры для управления заявками
    setUserParticipation: (
      state,
      action: PayloadAction<{ roomId: number; participant: RoomParticipant }>
    ) => {
      const { roomId, participant } = action.payload
      // Защита от undefined
      if (!state.userParticipations) {
        state.userParticipations = {}
      }
      state.userParticipations[roomId] = participant
    },
    updateParticipationStatus: (
      state,
      action: PayloadAction<{
        roomId: number
        status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
      }>
    ) => {
      const { roomId, status } = action.payload
      // Защита от undefined
      if (!state.userParticipations) {
        state.userParticipations = {}
      }
      if (state.userParticipations[roomId]) {
        state.userParticipations[roomId].status = status
      }
    },
    clearUserParticipation: (state, action: PayloadAction<number>) => {
      const roomId = action.payload
      // Защита от undefined
      if (!state.userParticipations) {
        state.userParticipations = {}
        return
      }
      delete state.userParticipations[roomId]
    },
    clearAllUserParticipations: (state) => {
      state.userParticipations = {}
    },
    // Здесь можно будет добавить другие синхронные редьюсеры:
    // updateRoom, removeRoom, addParticipantToRoom, etc.
  },
  extraReducers: (builder) => {
    builder
      // Create Room
      .addCase(createRoom.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(
        createRoom.fulfilled,
        (state, action: PayloadAction<ApiRoom>) => {
          state.isLoading = false
          state.rooms.push(action.payload) // Добавляем созданную комнату в список
          // state.activeRoom = action.payload; // Опционально: сделать созданную комнату активной
        }
      )
      .addCase(createRoom.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload // action.payload здесь это rejectValue
      })
      // Fetch Rooms
      .addCase(fetchRooms.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(
        fetchRooms.fulfilled,
        (state, action: PayloadAction<ApiRoom[]>) => {
          state.isLoading = false
          state.rooms = action.payload
        }
      )
      .addCase(fetchRooms.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Send Join Request
      .addCase(sendJoinRequest.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(sendJoinRequest.fulfilled, (state, action) => {
        state.isLoading = false
        const { roomId, participant } = action.payload
        // Защита от undefined
        if (!state.userParticipations) {
          state.userParticipations = {}
        }
        state.userParticipations[roomId] = participant
      })
      .addCase(sendJoinRequest.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Очищаем userParticipations при логауте пользователя
      .addMatcher(
        (action) =>
          action.type === 'user/logoutUser' || action.type === 'user/clearUser',
        (state) => {
          state.userParticipations = {}
        }
      )
  },
})

export const {
  setActiveRoom,
  clearRoomError,
  setUserParticipation,
  updateParticipationStatus,
  clearUserParticipation,
  clearAllUserParticipations,
} = roomSlice.actions

export default roomSlice.reducer
