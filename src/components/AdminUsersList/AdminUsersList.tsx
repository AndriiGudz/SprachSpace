import { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Box,
  Container,
  TextField,
  IconButton,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  useTheme,
  useMediaQuery,
  InputAdornment,
  FormControl,
  InputLabel,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material'
import { Search } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { UserSliceState } from '../../store/redux/userSlice/types'
import Loader from '../Loader/Loader'

// Helper component for highlighting text
function HighlightedText({
  text,
  highlight,
}: {
  text: string
  highlight: string
}) {
  if (!highlight.trim()) {
    return <>{text}</>
  }
  // Escape regex special characters in highlight string
  const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\\\]/g, '\\\\$&')
  const parts = text.split(new RegExp(`(${escapedHighlight})`, 'gi'))
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <Box
            component="strong"
            key={i}
            sx={{ color: 'primary.main', fontWeight: 'bold' }}
          >
            {part}
          </Box>
        ) : (
          part
        )
      )}
    </>
  )
}

function UserList() {
  const { t } = useTranslation()
  const [users, setUsers] = useState<UserSliceState[]>([])
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [rating, setRating] = useState('all')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const navigate = useNavigate()

  // Функция для выполнения запроса на сервер
  const fetchUsersFromServer = (searchTerm?: string) => {
    setLoading(true)
    const url = searchTerm
      ? `http://localhost:8080/api/users/findAnyUsers?keyword=${encodeURIComponent(
          searchTerm
        )}`
      : 'http://localhost:8080/api/users'

    fetch(url)
      .then((response) => response.json())
      .then((data: UserSliceState[]) => {
        setUsers(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setError('Ошибка загрузки пользователей')
        setLoading(false)
      })
  }

  // Запрос данных с сервера при монтировании компонента (загрузка всех пользователей)
  useEffect(() => {
    fetchUsersFromServer() // Загружаем всех пользователей при первом рендере
  }, []) // Пустой массив зависимостей для выполнения только один раз

  // Effect for generating suggestions based on search input and users list
  useEffect(() => {
    if (search.trim() === '') {
      setSuggestions([])
      return
    }

    const newSuggestions: string[] = []
    const uniqueSuggestions = new Set<string>()

    users.forEach((user) => {
      const fieldsToSearch: (keyof UserSliceState)[] = [
        'id',
        'nickname',
        'name',
        'surname',
        'email',
      ]
      fieldsToSearch.forEach((field) => {
        const value = user[field]
        if (value !== null && value !== undefined) {
          const stringValue = String(value).toLowerCase()
          if (stringValue.includes(search.toLowerCase())) {
            const originalDisplayValue = String(user[field])
            if (!uniqueSuggestions.has(originalDisplayValue)) {
              uniqueSuggestions.add(originalDisplayValue)
              newSuggestions.push(originalDisplayValue)
            }
          }
        }
      })
    })

    setSuggestions(newSuggestions.slice(0, 10)) // Limit to 10 suggestions
  }, [search, users])

  // Effect to control suggestion visibility based on focus, search text, and available suggestions
  useEffect(() => {
    if (isSearchFocused && search.trim() !== '' && suggestions.length > 0) {
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }, [isSearchFocused, search, suggestions])

  // Effect to handle clicks outside the search container to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
        setIsSearchFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [searchContainerRef])

  // Обработчик для запуска поиска
  const handleSearchSubmit = () => {
    if (search.trim() === '') {
      // Если поисковой запрос пуст, загружаем всех пользователей
      fetchUsersFromServer()
    } else {
      // Иначе выполняем поиск
      fetchUsersFromServer(search)
    }
  }

  // Обработчик нажатия Enter в поле поиска
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearchSubmit()
    }
  }

  const itemsPerPage = 10

  // Фильтрация пользователей по статусу и рейтингу (поиск теперь на бэкенде)
  const filteredUsers = users.filter((user: UserSliceState) => {
    const matchesStatus =
      status === 'all' ||
      (status === 'active' && user.status === true) ||
      (status === 'blocked' && user.status === false)
    const matchesRating = rating === 'all' || user.rating?.toString() === rating
    return matchesStatus && matchesRating // Убираем matchesSearch
  })

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value)
  }

  const handleUserClick = (userId: number) => {
    navigate(`/admin/users/${userId}`)
  }

  const displayedUsers = filteredUsers.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  )

  if (loading) return <Loader />
  if (error) return <div>{error}</div>

  return (
    <Container
      maxWidth={false}
      sx={{
        width: {
          xs: '100%', // для мобильных и планшетов — ширина 100%
          md: '1200px', // для десктопов — фиксированная ширина 1200px
        },
        backgroundColor: 'white', // белый фон
        borderRadius: '4px', // скругление углов
        boxShadow: '0px 0px 24px 0px rgba(0, 0, 0, 0.25)', // тень
        py: 4, // внутренние отступы по вертикали
        mx: 'auto', // центровка по горизонтали
        marginTop: 4, // отступ сверху
      }}
    >
      <Box sx={{ mb: 4 }}>
        <Box sx={{ position: 'relative', mb: 2 }} ref={searchContainerRef}>
          <TextField
            fullWidth
            placeholder={t('adminUsersList.searchPlaceholder')}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
            }}
            onKeyPress={handleKeyPress}
            onFocus={() => {
              setIsSearchFocused(true)
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSearchSubmit}>
                    <Search />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            className="inputGrey"
          />
          {showSuggestions && suggestions.length > 0 && (
            <Paper
              elevation={3}
              sx={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                zIndex: 1300,
                maxHeight: '300px',
                overflowY: 'auto',
              }}
            >
              <List dense>
                {suggestions.map((suggestion, index) => (
                  <ListItemButton
                    key={index}
                    onClick={() => {
                      setSearch(suggestion)
                      setShowSuggestions(false)
                    }}
                  >
                    <ListItemText
                      primary={
                        <HighlightedText text={suggestion} highlight={search} />
                      }
                    />
                  </ListItemButton>
                ))}
              </List>
            </Paper>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 2, pt: 1 }}>
          <FormControl variant="outlined" sx={{ width: '150px' }}>
            <InputLabel>{t('adminUsersList.status')}</InputLabel>
            <Select
              variant="outlined"
              value={status}
              label={t('adminUsersList.status')}
              onChange={(e) => setStatus(e.target.value as string)}
              sx={{
                height: '32px',
                '& .MuiSelect-select': {
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 14px',
                  lineHeight: '32px',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#E0E0E0',
                },
              }}
            >
              <MenuItem value="all">{t('adminUsersList.allUsers')}</MenuItem>
              <MenuItem value="active">{t('adminUsersList.active')}</MenuItem>
              <MenuItem value="blocked">{t('adminUsersList.blocked')}</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined" sx={{ width: '150px' }}>
            <InputLabel>{t('adminUsersList.rating')}</InputLabel>
            <Select
              variant="outlined"
              value={rating}
              label={t('adminUsersList.rating')}
              onChange={(e) => setRating(e.target.value as string)}
              sx={{
                height: '32px',
                '& .MuiSelect-select': {
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 14px',
                  lineHeight: '32px',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#E0E0E0',
                },
              }}
            >
              <MenuItem value="all">{t('adminUsersList.allRatings')}</MenuItem>
              <MenuItem value="4.5">4.5</MenuItem>
              <MenuItem value="4.0">4.0</MenuItem>
              <MenuItem value="3.5">3.5</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ boxShadow: 'none' }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: '#EEE' }}>
            <TableRow>
              <TableCell>{t('adminUsersList.id')}</TableCell>
              {!isMobile && (
                <TableCell>{t('adminUsersList.nickname')}</TableCell>
              )}
              {!isMobile && <TableCell>{t('adminUsersList.name')}</TableCell>}
              {!isMobile && (
                <TableCell>{t('adminUsersList.surname')}</TableCell>
              )}
              <TableCell>{t('adminUsersList.email')}</TableCell>
              {!isMobile && <TableCell>{t('adminUsersList.rating')}</TableCell>}
              <TableCell>{t('adminUsersList.status')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedUsers.map((user: UserSliceState) => (
              <TableRow
                key={user.id}
                onClick={() => handleUserClick(user.id!)}
                sx={{
                  backgroundColor: '#F5F5F5',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#EEE' },
                }}
              >
                <TableCell sx={{ fontSize: '14px', fontWeight: '300' }}>
                  {user.id}
                </TableCell>
                {!isMobile && (
                  <TableCell sx={{ fontSize: '14px', fontWeight: '300' }}>
                    {user.nickname}
                  </TableCell>
                )}
                {!isMobile && (
                  <TableCell sx={{ fontSize: '14px', fontWeight: '300' }}>
                    {user.name}
                  </TableCell>
                )}
                {!isMobile && (
                  <TableCell sx={{ fontSize: '14px', fontWeight: '300' }}>
                    {user.surname}
                  </TableCell>
                )}
                <TableCell sx={{ fontSize: '14px', fontWeight: '300' }}>
                  {user.email}
                </TableCell>
                {!isMobile && (
                  <TableCell sx={{ fontSize: '14px', fontWeight: '300' }}>
                    ⭐ {user.rating}
                  </TableCell>
                )}
                <TableCell>
                  <Box
                    component="span"
                    sx={{
                      fontSize: '14px',
                      fontWeight: '300',
                      color: user.status ? 'success.main' : 'error.main',
                    }}
                  >
                    {user.status
                      ? t('adminUsersList.active')
                      : t('adminUsersList.blocked')}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={Math.ceil(filteredUsers.length / itemsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Container>
  )
}

export default UserList
