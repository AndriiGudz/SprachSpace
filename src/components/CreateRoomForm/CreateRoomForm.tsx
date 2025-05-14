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
import { useSelector, useDispatch } from 'react-redux'
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
import type { RootState, AppDispatch } from '../../store/store'
import Loader from '../Loader/Loader'
import {
  createRoom,
  clearRoomError,
} from '../../store/redux/roomSlice/roomSlice'
import { CreateRoomApiRequest } from '../../store/redux/roomSlice/roomTypes'

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
  const dispatch = useDispatch<AppDispatch>()
  const { isAuthenticated, id: userIdFromAuth } = useSelector(
    (state: RootState) => state.user
  )
  const { isLoading: isRoomCreating, error: roomCreationError } = useSelector(
    (state: RootState) => state.rooms
  )

  const [languages, setLanguages] = useState<{ id: number; name: string }[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
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
    if (roomCreationError) {
      toast.error(roomCreationError)
      dispatch(clearRoomError())
    }
  }, [roomCreationError, dispatch])

  useEffect(() => {
    if (!isAuthenticated) {
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

  const onSubmit: SubmitHandler<CreateRoomFormData> = async (data) => {
    if (!userIdFromAuth) {
      toast.error(t('common.unauthorized'))
      return
    }

    const roomApiRequest: CreateRoomApiRequest = {
      topic: data.name,
      startTime: new Date(data.openAt).toISOString(),
      endTime: new Date(data.closeAt).toISOString(),
      status: true,
      age: data.ageLimit || 0,
      language: data.language,
      minQuantity: data.minParticipants,
      maxQuantity: data.maxParticipants || data.minParticipants,
    }

    try {
      const createdApiRoom = await dispatch(
        createRoom({ roomData: roomApiRequest, userId: String(userIdFromAuth) })
      ).unwrap()

      toast.success(t('createRoomForm.roomCreatedSuccess'))

      onRoomCreated({
        id: createdApiRoom.id,
        name: createdApiRoom.topic,
        category: data.category,
        openAt: new Date(createdApiRoom.startTime),
        closeAt: new Date(createdApiRoom.endTime),
        minParticipants: createdApiRoom.minQuantity,
        maxParticipants: createdApiRoom.maxQuantity,
        ageLimit: createdApiRoom.age,
        roomUrl: createdApiRoom.roomUrl,
        language: createdApiRoom.language,
        proficiency: data.proficiency,
      })

      reset({
        name: '',
        category: categories[0],
        language: '',
        proficiency: '',
        openAt: '',
        closeAt: '',
        minParticipants: 4,
        maxParticipants: null,
        ageLimit: null,
      })
    } catch (error: any) {
      console.error('Failed to create room (onSubmit):', error)
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
      {isRoomCreating && (
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
          disabled={isRoomCreating}
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
          disabled={isRoomCreating}
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
            disabled={isRoomCreating}
            defaultValue=""
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
            disabled={isRoomCreating}
            defaultValue=""
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
            disabled={isRoomCreating}
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
            disabled={isRoomCreating}
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
            disabled={isRoomCreating}
          />

          <TextField
            variant="outlined"
            label={t('createRoomForm.maxParticipants')}
            type="number"
            {...register('maxParticipants')}
            error={!!errors.maxParticipants}
            helperText={errors.maxParticipants?.message}
            sx={filterItemStyle}
            disabled={isRoomCreating}
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
          disabled={isRoomCreating}
        />

        <Button
          type="submit"
          variant="contained"
          sx={createButtonStyle}
          disabled={isRoomCreating}
        >
          {isRoomCreating
            ? t('common.loading')
            : t('createRoomForm.createRoomButton')}
        </Button>
      </Stack>
    </Box>
  )
}

export default CreateRoomForm
