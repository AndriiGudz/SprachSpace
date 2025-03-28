import { useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { containerStyle, filterItemStyle, createButtonStyle } from './styles'
import CreateRoomForm, { Room } from '../CreateRoomForm/CreateRoomForm'
import { useTranslation } from 'react-i18next'

const RoomFilter = () => {
  const { t } = useTranslation()

  const [category, setCategory] = useState('')
  const [language, setLanguage] = useState('')
  const [proficiency, setProficiency] = useState('')
  const [date, setDate] = useState('')
  const [openDialog, setOpenDialog] = useState(false)

  const handleApply = () => {
    console.log(t('applyFilters'), { category, language, date })
  }

  const handleReset = () => {
    setCategory('')
    setLanguage('')
    setProficiency('')
    setDate('')
  }

  const handleCreateRoom = () => {
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const handleRoomCreated = (room: Room) => {
    console.log(t('roomCreated'), room)
    setOpenDialog(false)
  }

  return (
    <>
      <Box sx={containerStyle}>
        <Box
          sx={{
            maxWidth: '1200px',
            mx: 'auto',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: 3,
            px: 2,
          }}
        >
          {/* Фильтры */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 3,
              flex: 1,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 3,
                flex: 1,
              }}
            >
              <FormControl variant="outlined" sx={filterItemStyle}>
                <InputLabel id="category-label">{t('roomFilter.category')}</InputLabel>
                <Select
                  labelId="category-label"
                  value={category}
                  label={t('roomFilter.category')}
                  onChange={(e) => setCategory(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#E0E0E0',
                    },
                  }}
                >
                  <MenuItem value="">Not selected</MenuItem>
                  <MenuItem value="food">Food</MenuItem>
                  <MenuItem value="music">Music</MenuItem>
                  <MenuItem value="tech">Tech</MenuItem>
                </Select>
              </FormControl>

              <FormControl variant="outlined" sx={filterItemStyle}>
                <InputLabel id="language-label">{t('roomFilter.language')}</InputLabel>
                <Select
                  labelId="language-label"
                  value={language}
                  label={t('roomFilter.language')}
                  onChange={(e) => setLanguage(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#E0E0E0',
                    },
                  }}
                >
                  <MenuItem value="">Not selected</MenuItem>
                  <MenuItem value="ru">Russian</MenuItem>
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="fr">French</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 3,
                flex: 1,
              }}
            >
              <FormControl variant="outlined" sx={filterItemStyle}>
                <InputLabel id="proficiency-label">{t('roomFilter.proficiency')}</InputLabel>
                <Select
                  labelId="proficiency-label"
                  value={proficiency}
                  label={t('roomFilter.proficiency')}
                  onChange={(e) => setProficiency(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#E0E0E0',
                    },
                  }}
                >
                  <MenuItem value="">Not selected</MenuItem>
                  <MenuItem value="ru">beginner</MenuItem>
                  <MenuItem value="en">intermediate</MenuItem>
                  <MenuItem value="fr">advanced</MenuItem>
                </Select>
              </FormControl>

              <TextField
                variant="outlined"
                label={t('roomFilter.date')}
                type="date"
                InputLabelProps={{ shrink: true }}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                sx={filterItemStyle}
              />
            </Box>
          </Box>

          {/* Кнопки Apply и Reset */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              width: { xs: '100%', md: '100%' },
              justifyContent: { xs: 'center', md: 'flex-start' },
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleApply}
              sx={{ textTransform: 'none' }}
            >
              {t('roomFilter.apply')}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleReset}
              sx={{ textTransform: 'none' }}
            >
              {t('roomFilter.reset')}
            </Button>
          </Box>

          {/* Кнопка Create room */}
          <Box
            sx={{
              display: 'flex',
              width: { xs: '100%', md: '100%' },
              justifyContent: { xs: 'center', md: 'right' },
              textAlign: { xs: 'center', md: 'right' },
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              onClick={handleCreateRoom}
              sx={createButtonStyle}
            >
              {t('roomFilter.createRoom')}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Модальное окно */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <IconButton
            aria-label={t('close')}
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <CreateRoomForm onRoomCreated={handleRoomCreated} />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default RoomFilter
// Добавить проверку для кнопки Create room