import { useEffect, useState } from 'react'
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
} from '@mui/material'
import { Search } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { UserSlaceState } from '../../store/redux/userSlice/types'
import Loader from '../Loader/Loader'

function UserList() {
  const [users, setUsers] = useState<UserSlaceState[]>([])
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [rating, setRating] = useState('all')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const navigate = useNavigate()

  // Запрос данных с сервера при монтировании компонента
  useEffect(() => {
    setLoading(true)
    fetch('http://localhost:8080/api/users')
      .then((response) => response.json())
      .then((data: UserSlaceState[]) => {
        setUsers(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setError('Ошибка загрузки пользователей')
        setLoading(false)
      })
  }, [])

  const itemsPerPage = 10

  // Фильтрация пользователей по поиску, статусу и рейтингу
  const filteredUsers = users.filter((user: UserSlaceState) => {
    const matchesSearch = Object.values(user).some(
      (value) =>
        value && value.toString().toLowerCase().includes(search.toLowerCase())
    )
    const matchesStatus =
      status === 'all' ||
      (status === 'active' && user.status === true) ||
      (status === 'blocked' && user.status === false)
    const matchesRating = rating === 'all' || user.rating!.toString() === rating
    return matchesSearch && matchesStatus && matchesRating
  })

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value)
  }

  const handleUserClick = (userId: string) => {
    navigate(`/user/${userId}`)
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
        <TextField
          fullWidth
          placeholder="Search by name, email, user ID, etc."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <Search />
                </IconButton>
              </InputAdornment>
            ),
          }}
          className="inputGrey"
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', gap: 2, pt: 1 }}>
          <FormControl variant="outlined" sx={{ width: '150px' }}>
            <InputLabel>Status</InputLabel>
            <Select
              variant="outlined"
              value={status}
              label="Status"
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
              <MenuItem value="all">All users</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="blocked">Blocked</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined" sx={{ width: '150px' }}>
            <InputLabel>Rating</InputLabel>
            <Select
              variant="outlined"
              value={rating}
              label="Rating"
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
              <MenuItem value="all">All ratings</MenuItem>
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
              <TableCell>ID</TableCell>
              {!isMobile && <TableCell>Nickname</TableCell>}
              {!isMobile && <TableCell>Name</TableCell>}
              {!isMobile && <TableCell>Surname</TableCell>}
              <TableCell>Email</TableCell>
              {!isMobile && <TableCell>Rating</TableCell>}
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedUsers.map((user: UserSlaceState) => (
              <TableRow
                key={user.id!}
                onClick={() => handleUserClick(user.id!.toString())}
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
                    {user.status ? 'active' : 'blocked'}
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
