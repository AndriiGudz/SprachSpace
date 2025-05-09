import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated)

  // Если пользователь не авторизован, отправляем на страницу входа
  return isAuthenticated ? children : <Navigate to="/signin" replace />
}

export default ProtectedRoute;