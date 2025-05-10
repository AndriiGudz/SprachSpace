import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'

const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, roles } = useSelector(
    (state: RootState) => state.user
  )

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />
  }

  // Проверяем наличие роли администратора в массиве ролей
  const isAdmin = roles?.some((role) => role.title === 'ROLE_ADMIN')

  if (!roles || !isAdmin) {
    return <Navigate to="/" replace />
  }

  return children
}

export default AdminRoute
// Проверить при добавлении ролей
