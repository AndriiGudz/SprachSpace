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
import { containerStyle, createButtonStyle, filterItemStyle } from './styles'
import {
  createRoomSchema,
  CreateRoomFormData,
} from '../../validationSchemas/CreateRoomSchema'

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
  const [languages, setLanguages] = useState<{ id: number; name: string }[]>([])

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

  // Загружаем список языков с сервера при монтировании компонента
  useEffect(() => {
    fetch('http://localhost:8080/api/language')
      .then((response) => response.json())
      .then((data) => setLanguages(data))
      .catch((error) => console.error('Error fetching languages:', error))
  }, [])

  const onSubmit: SubmitHandler<CreateRoomFormData> = (data) => {
    const newRoom: Room = {
      id: `room-${Date.now()}`,
      name: data.name,
      category: data.category,
      openAt: new Date(data.openAt),
      closeAt: new Date(data.closeAt),
      minParticipants: data.minParticipants,
      maxParticipants: data.maxParticipants || undefined,
      ageLimit: data.ageLimit || undefined,
      roomUrl: `https://daily.fake/room-${Date.now()}`,
      language: data.language,
      proficiency: data.proficiency,
    }

    onRoomCreated(newRoom)

    // Сброс формы
    setValue('name', '')
    setValue('category', categories[0])
    setValue('openAt', '')
    setValue('closeAt', '')
    setValue('minParticipants', 4)
    setValue('maxParticipants', null)
    setValue('ageLimit', null)
    setValue('language', '')
    setValue('proficiency', '')
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={containerStyle}>
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

        <Button type="submit" variant="contained" sx={createButtonStyle}>
          {t('createRoomForm.createRoomButton')}
        </Button>
      </Stack>
    </Box>
  )
}

export default CreateRoomForm
