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
import { containerStyle, createButtonStyle, filterItemStyle } from './styles'

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

  // Загружаем список языков с сервера при монтировании компонента
  useEffect(() => {
    fetch('http://localhost:8080/api/language')
      .then(response => response.json())
      .then(data => setLanguages(data))
      .catch(error => console.error("Error fetching languages:", error))
  }, [])

  const [form, setForm] = useState({
    name: '',
    category: categories[0],
    openAt: '',
    closeAt: '',
    minParticipants: 4,
    maxParticipants: '',
    ageLimit: '',
    language: '',
    proficiency: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newRoom: Room = {
      id: `room-${Date.now()}`,
      name: form.name,
      category: form.category,
      openAt: new Date(form.openAt),
      closeAt: new Date(form.closeAt),
      minParticipants: Number(form.minParticipants) || 4,
      maxParticipants: form.maxParticipants
        ? Number(form.maxParticipants)
        : undefined,
      ageLimit: form.ageLimit ? Number(form.ageLimit) : undefined,
      roomUrl: `https://daily.fake/room-${Date.now()}`,
      language: form.language,
      proficiency: form.proficiency,
    }

    onRoomCreated(newRoom)

    setForm({
      name: '',
      category: categories[0],
      openAt: '',
      closeAt: '',
      minParticipants: 4,
      maxParticipants: '',
      ageLimit: '',
      language: '',
      proficiency: '',
    })
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={containerStyle}>
      <Typography variant="h3" gutterBottom>
        {t('createRoomForm.createRoom')}
      </Typography>

      <Stack spacing={2} sx={{ alignItems: 'center' }}>
        <TextField
          variant="outlined"
          label={t('createRoomForm.roomName')}
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          sx={filterItemStyle}
        />

        <TextField
          variant="outlined"
          label={t('createRoomForm.category')}
          name="category"
          select
          value={form.category}
          onChange={handleChange}
          required
          sx={filterItemStyle}
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </TextField>

        {/* Языки */}
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
            name="language"
            select
            value={form.language}
            onChange={handleChange}
            required
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
            name="proficiency"
            select
            value={form.proficiency}
            onChange={handleChange}
            required
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
            name="openAt"
            type="datetime-local"
            value={form.openAt}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
            sx={filterItemStyle}
          />
          <TextField
            variant="outlined"
            label={t('createRoomForm.closeTime')}
            name="closeAt"
            type="datetime-local"
            value={form.closeAt}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
            sx={filterItemStyle}
          />
        </Box>

        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: 0,
          }}
        >
          <TextField
            variant="outlined"
            label={t('createRoomForm.minParticipants')}
            name="minParticipants"
            type="number"
            inputProps={{ min: 4 }}
            value={form.minParticipants}
            onChange={handleChange}
            required
            sx={filterItemStyle}
          />

          <TextField
            variant="outlined"
            label={t('createRoomForm.maxParticipants')}
            name="maxParticipants"
            type="number"
            inputProps={{ min: 1 }}
            value={form.maxParticipants}
            onChange={handleChange}
            sx={filterItemStyle}
          />
        </Box>

        <TextField
          variant="outlined"
          label={t('createRoomForm.ageLimit')}
          name="ageLimit"
          type="number"
          inputProps={{ min: 1 }}
          value={form.ageLimit}
          onChange={handleChange}
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
// Добавить обработку ошибок и валидацию формы