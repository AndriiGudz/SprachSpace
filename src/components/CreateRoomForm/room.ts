export type ParticipantStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED'
export type ParticipantType = 'INVITED_BY_CREATOR' | 'JOINED'

export interface RoomParticipant {
  id: number
  room: string
  user: string
  status: ParticipantStatus
  participantType: ParticipantType
}

export interface CreateRoomRequest {
  topic: string
  startTime: string
  endTime: string
  status: boolean
  age: number
  language: string
  minQuantity: number
  maxQuantity: number
}

export interface RoomResponse {
  id: number
  topic: string
  startTime: string
  endTime: string
  duration: number
  status: boolean
  age: number
  language: string
  minQuantity: number
  maxQuantity: number
  roomUrl: string
  participants: string[]
}
