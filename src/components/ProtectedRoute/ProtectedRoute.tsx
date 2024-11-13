import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface ProtectedRouteProps {
  children: JSX.Element;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

  if (!isAuthenticated) {
    // Перенаправление на страницу входа, если пользователь не авторизован
    return <Navigate to="/signin" replace />;
  }

  return children;
}

export default ProtectedRoute;
