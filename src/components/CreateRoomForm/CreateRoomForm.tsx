import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useForm, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import {
  containerStyle,
  createButtonStyle,
  filterItemStyle,
  loaderWrapperStyle,
} from './styles'
import {
  createRoomSchema,
  CreateRoomFormData,
} from '../../validationSchemas/CreateRoomSchema'
import { CreateRoomRequest, RoomResponse } from './room'
import type { RootState } from '../../store/store'
import Loader from '../Loader/Loader'

const categories = [
  'Разговорный английский',
  'Deutsch lernen',
  'Business Talks',
  'Свободная беседа',
]

const LEVEL_OPTIONS = ['beginner', 'intermediate', 'advanced']

export type Room = {
  id: string
  name: string
  category: string
  openAt: Date
  closeAt: Date
  minParticipants: number
  maxParticipants?: number
  ageLimit?: number
  roomUrl: string
  language: string
  proficiency: string
}

type Props = {
  onRoomCreated: (room: Room) => void
}

const CreateRoomForm: React.FC<Props> = ({ onRoomCreated }) => {
  const { t } = useTranslation()
  const { isAuthenticated, id: userId } = useSelector(
    (state: RootState) => state.user
  )
  const [languages, setLanguages] = useState<{ id: number; name: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreateRoomFormData>({
    resolver: yupResolver(createRoomSchema(t)) as any,
    mode: 'onChange',
    defaultValues: {
      category: categories[0],
      minParticipants: 4,
      maxParticipants: null,
      ageLimit: null,
    },
  })

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error(t('common.unauthorized'))
      return
    }

    fetch('http://localhost:8080/api/language')
      .then((response) => response.json())
      .then((data) => setLanguages(data))
      .catch((error) => {
        console.error('Error fetching languages:', error)
        toast.error(t('common.error'))
      })
  }, [isAuthenticated, t])

  const createRoom = async (
    roomData: CreateRoomRequest
  ): Promise<RoomResponse> => {
    if (!userId) {
      throw new Error('User not authenticated')
    }

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
      throw new Error('Failed to create room')
    }

    return response.json()
  }

  const onSubmit: SubmitHandler<CreateRoomFormData> = async (data) => {
    if (!userId) {
      toast.error(t('common.unauthorized'))
      return
    }

    try {
      setIsLoading(true)

      const roomRequest: CreateRoomRequest = {
        topic: data.name,
        startTime: new Date(data.openAt).toISOString(),
        endTime: new Date(data.closeAt).toISOString(),
        status: true,
        age: data.ageLimit || 0,
        language: data.language,
        minQuantity: data.minParticipants,
        maxQuantity: data.maxParticipants || data.minParticipants,
      }

      const createdRoom = await createRoom(roomRequest)

      toast.success(t('createRoomForm.roomCreatedSuccess'))
      onRoomCreated({
        id: String(createdRoom.id),
        name: createdRoom.topic,
        category: data.category,
        openAt: new Date(createdRoom.startTime),
        closeAt: new Date(createdRoom.endTime),
        minParticipants: createdRoom.minQuantity,
        maxParticipants: createdRoom.maxQuantity,
        ageLimit: createdRoom.age,
        roomUrl: createdRoom.roomUrl,
        language: createdRoom.language,
        proficiency: data.proficiency,
      })

      // Reset form
      setValue('name', '')
      setValue('category', categories[0])
      setValue('openAt', '')
      setValue('closeAt', '')
      setValue('minParticipants', 4)
      setValue('maxParticipants', null)
      setValue('ageLimit', null)
      setValue('language', '')
      setValue('proficiency', '')
    } catch (error) {
      console.error('Failed to create room:', error)
      toast.error(t('createRoomForm.roomCreationError'))
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <Box sx={containerStyle}>
        <Typography variant="h6" color="error">
          {t('common.pleaseLogin')}
        </Typography>
      </Box>
    )
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={containerStyle}>
      {isLoading && (
        <Box sx={loaderWrapperStyle}>
          <Loader />
        </Box>
      )}
      <Typography variant="h3" gutterBottom>
        {t('createRoomForm.createRoom')}
      </Typography>

      <Stack spacing={2} sx={{ alignItems: 'center' }}>
        <TextField
          variant="outlined"
          label={t('createRoomForm.roomName')}
          {...register('name')}
          error={!!errors.name}
          helperText={errors.name?.message}
          sx={filterItemStyle}
        />

        <TextField
          variant="outlined"
          label={t('createRoomForm.category')}
          select
          {...register('category')}
          error={!!errors.category}
          helperText={errors.category?.message}
          defaultValue={categories[0]}
          sx={filterItemStyle}
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </TextField>

        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
          }}
        >
          <TextField
            variant="outlined"
            label={t('createRoomForm.roomLanguage')}
            select
            {...register('language')}
            error={!!errors.language}
            helperText={errors.language?.message}
            sx={filterItemStyle}
          >
            {languages.map((lang) => (
              <MenuItem key={lang.id} value={lang.name}>
                {lang.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            variant="outlined"
            label={t('createRoomForm.proficiency')}
            select
            {...register('proficiency')}
            error={!!errors.proficiency}
            helperText={errors.proficiency?.message}
            sx={filterItemStyle}
          >
            {LEVEL_OPTIONS.map((level) => (
              <MenuItem key={level} value={level}>
                {level}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
          }}
        >
          <TextField
            variant="outlined"
            label={t('createRoomForm.openTime')}
            type="datetime-local"
            {...register('openAt')}
            error={!!errors.openAt}
            helperText={errors.openAt?.message}
            InputLabelProps={{ shrink: true }}
            sx={filterItemStyle}
          />

          <TextField
            variant="outlined"
            label={t('createRoomForm.closeTime')}
            type="datetime-local"
            {...register('closeAt')}
            error={!!errors.closeAt}
            helperText={errors.closeAt?.message}
            InputLabelProps={{ shrink: true }}
            sx={filterItemStyle}
          />
        </Box>

        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
          }}
        >
          <TextField
            variant="outlined"
            label={t('createRoomForm.minParticipants')}
            type="number"
            {...register('minParticipants')}
            error={!!errors.minParticipants}
            helperText={errors.minParticipants?.message}
            sx={filterItemStyle}
          />

          <TextField
            variant="outlined"
            label={t('createRoomForm.maxParticipants')}
            type="number"
            {...register('maxParticipants')}
            error={!!errors.maxParticipants}
            helperText={errors.maxParticipants?.message}
            sx={filterItemStyle}
          />
        </Box>

        <TextField
          variant="outlined"
          label={t('createRoomForm.ageLimit')}
          type="number"
          {...register('ageLimit')}
          error={!!errors.ageLimit}
          helperText={errors.ageLimit?.message}
          sx={filterItemStyle}
        />

        <Button
          type="submit"
          variant="contained"
          sx={createButtonStyle}
          disabled={isLoading}
        >
          {isLoading
            ? t('common.loading')
            : t('createRoomForm.createRoomButton')}
        </Button>
      </Stack>
    </Box>
  )
}

export default CreateRoomForm
