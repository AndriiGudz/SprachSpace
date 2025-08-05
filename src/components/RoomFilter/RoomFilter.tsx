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

export interface RoomFilters {
  category: string
  language: string
  proficiency: string
  date: string
}

interface RoomFilterProps {
  onFiltersChange: (filters: RoomFilters) => void
}

const RoomFilter = ({ onFiltersChange }: RoomFilterProps) => {
  const { t } = useTranslation()

  const [filters, setFilters] = useState<RoomFilters>({
    category: '',
    language: '',
    proficiency: '',
    date: '',
  })

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

  const handleFilterChange = (field: keyof RoomFilters, value: string) => {
    // Если значение пустое, сбрасываем фильтр
    if (!value) {
      const newFilters = { ...filters, [field]: '' }
      setFilters(newFilters)
      onFiltersChange(newFilters)
      return
    }

    let newFilters = { ...filters }

    if (field === 'language') {
      const selectedLanguage = languages.find(
        (lang) => lang.id.toString() === value
      )
      if (selectedLanguage) {
        newFilters.language = value // Сохраняем ID
      }
    } else if (field === 'category') {
      const selectedCategory = categories.find(
        (cat) => cat.id.toString() === value
      )
      if (selectedCategory) {
        newFilters.category = value // Сохраняем ID
      }
    } else {
      newFilters[field] = value
    }

    setFilters(newFilters)
  }

  const handleApply = () => {
    // При применении фильтров преобразуем ID в имена
    const appliedFilters = {
      ...filters,
      category: filters.category
        ? categories.find((cat) => cat.id.toString() === filters.category)
            ?.name || ''
        : '',
      language: filters.language
        ? languages.find((lang) => lang.id.toString() === filters.language)
            ?.name || ''
        : '',
    }
    onFiltersChange(appliedFilters)
  }

  const handleReset = () => {
    const resetFilters = {
      category: '',
      language: '',
      proficiency: '',
      date: '',
    }
    setFilters(resetFilters)
    onFiltersChange(resetFilters)
  }

  const handleRoomCreated = (room: Room) => {
    // Обработка создания комнаты может быть добавлена позже
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
              className="withSelect"
              variant="outlined"
              sx={{ ...filterItemStyle, m: 0, flex: 1 }}
            >
              <InputLabel id="category-label">
                {t('roomFilter.category')}
              </InputLabel>
              <Select
                id="category-select"
                labelId="category-label"
                value={filters.category}
                label={t('roomFilter.category')}
                aria-labelledby="category-label"
                data-value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
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
                    <MenuItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>

            <FormControl
              className="withSelect"
              variant="outlined"
              sx={{ ...filterItemStyle, m: 0, flex: 1 }}
            >
              <InputLabel id="language-label">
                {t('roomFilter.language')}
              </InputLabel>
              <Select
                id="language-select"
                labelId="language-label"
                value={filters.language}
                label={t('roomFilter.language')}
                aria-labelledby="language-label"
                data-value={filters.language}
                onChange={(e) => handleFilterChange('language', e.target.value)}
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
                    <MenuItem key={lang.id} value={lang.id.toString()}>
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
              className="withSelect"
              variant="outlined"
              sx={{ ...filterItemStyle, m: 0, flex: 1 }}
            >
              <InputLabel id="proficiency-label">
                {t('roomFilter.proficiency')}
              </InputLabel>
              <Select
                id="proficiency-select"
                labelId="proficiency-label"
                value={filters.proficiency}
                label={t('roomFilter.proficiency')}
                aria-labelledby="proficiency-label"
                data-value={filters.proficiency}
                onChange={(e) =>
                  handleFilterChange('proficiency', e.target.value)
                }
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
              value={filters.date}
              onChange={(e) => handleFilterChange('date', e.target.value)}
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
