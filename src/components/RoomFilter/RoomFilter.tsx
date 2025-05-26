import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material'
import { containerStyle, filterItemStyle } from './styles'
import { useTranslation } from 'react-i18next'
import { CreateRoomButton } from '../CreateRoomButton/CreateRoomButton'
import { Room } from '../CreateRoomForm/CreateRoomForm'
import { getAllCategories, Category } from '../../api/categoryApi'
import { getAllLanguages, Language } from '../../api/languageApi'

const RoomFilter = () => {
  const { t } = useTranslation()

  const [category, setCategory] = useState('')
  const [language, setLanguage] = useState('')
  const [proficiency, setProficiency] = useState('')
  const [date, setDate] = useState('')

  const [categories, setCategories] = useState<Category[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true)
  const [categoryError, setCategoryError] = useState<string | null>(null)

  const [languages, setLanguages] = useState<Language[]>([])
  const [isLoadingLanguages, setIsLoadingLanguages] = useState<boolean>(true)
  const [languageError, setLanguageError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchCategories = async () => {
      try {
        const data = await getAllCategories()
        if (isMounted) {
          setCategories(data)
          setCategoryError(null)
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching categories:', error)
          setCategoryError(t('createRoomForm.errorFetchingCategories'))
        }
      } finally {
        if (isMounted) {
          setIsLoadingCategories(false)
        }
      }
    }

    fetchCategories()
    return () => {
      isMounted = false
    }
  }, [t])

  useEffect(() => {
    let isMounted = true

    const fetchLanguages = async () => {
      try {
        const data = await getAllLanguages()
        if (isMounted) {
          setLanguages(data)
          setLanguageError(null)
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching languages:', error)
          setLanguageError(t('common.errorFetchingLanguages'))
        }
      } finally {
        if (isMounted) {
          setIsLoadingLanguages(false)
        }
      }
    }

    fetchLanguages()
    return () => {
      isMounted = false
    }
  }, [t])

  const handleApply = () => {
    console.log('Applying filters:', { category, language, proficiency, date })
  }

  const handleReset = () => {
    setCategory('')
    setLanguage('')
    setProficiency('')
    setDate('')
  }

  const handleRoomCreated = (room: Room) => {
    console.log('Room created:', room)
  }

  return (
    <Box sx={containerStyle}>
      <Box
        sx={{
          maxWidth: '1200px',
          mx: 'auto',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          gap: 2,
          px: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2,
            flex: 1,
            width: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              flex: 1,
              width: '100%',
            }}
          >
            <FormControl
              variant="outlined"
              sx={{ ...filterItemStyle, m: 0, flex: 1 }}
            >
              <InputLabel id="category-label">
                {t('roomFilter.category')}
              </InputLabel>
              <Select
                labelId="category-label"
                value={category}
                label={t('roomFilter.category')}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isLoadingCategories}
              >
                <MenuItem value="">
                  <em>{t('roomFilter.notSelected')}</em>
                </MenuItem>
                {isLoadingCategories ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} />
                    <Box component="span" sx={{ ml: 1 }}>
                      {t('common.loading')}
                    </Box>
                  </MenuItem>
                ) : categoryError ? (
                  <MenuItem disabled>
                    <Alert severity="error">{categoryError}</Alert>
                  </MenuItem>
                ) : (
                  categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>

            <FormControl
              variant="outlined"
              sx={{ ...filterItemStyle, m: 0, flex: 1 }}
            >
              <InputLabel id="language-label">
                {t('roomFilter.language')}
              </InputLabel>
              <Select
                labelId="language-label"
                value={language}
                label={t('roomFilter.language')}
                onChange={(e) => setLanguage(e.target.value)}
                disabled={isLoadingLanguages}
              >
                <MenuItem value="">
                  <em>{t('roomFilter.notSelected')}</em>
                </MenuItem>
                {isLoadingLanguages ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} />
                    <Box component="span" sx={{ ml: 1 }}>
                      {t('common.loading')}
                    </Box>
                  </MenuItem>
                ) : languageError ? (
                  <MenuItem disabled>
                    <Alert severity="error">{languageError}</Alert>
                  </MenuItem>
                ) : (
                  languages.map((lang) => (
                    <MenuItem key={lang.id} value={lang.id}>
                      {lang.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              flex: 1,
              width: '100%',
            }}
          >
            <FormControl
              variant="outlined"
              sx={{ ...filterItemStyle, m: 0, flex: 1 }}
            >
              <InputLabel id="proficiency-label">
                {t('roomFilter.proficiency')}
              </InputLabel>
              <Select
                labelId="proficiency-label"
                value={proficiency}
                label={t('roomFilter.proficiency')}
                onChange={(e) => setProficiency(e.target.value)}
              >
                <MenuItem value="">
                  <em>{t('roomFilter.notSelected')}</em>
                </MenuItem>
                <MenuItem value="BEGINNER">
                  {t('createRoomForm.levels.beginner')}
                </MenuItem>
                <MenuItem value="INTERMEDIATE">
                  {t('createRoomForm.levels.intermediate')}
                </MenuItem>
                <MenuItem value="ADVANCED">
                  {t('createRoomForm.levels.advanced')}
                </MenuItem>
              </Select>
            </FormControl>

            <TextField
              variant="outlined"
              label={t('roomFilter.date')}
              type="date"
              InputLabelProps={{ shrink: true }}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              sx={{ ...filterItemStyle, m: 0, flex: 1 }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            justifyContent: { xs: 'center', md: 'flex-start' },
            minWidth: 'fit-content',
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

        <Box
          sx={{
            display: 'flex',
            justifyContent: { xs: 'center', md: 'flex-end' },
            minWidth: 'fit-content',
          }}
        >
          <CreateRoomButton onRoomCreated={handleRoomCreated} />
        </Box>
      </Box>
    </Box>
  )
}

export default RoomFilter
