import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, roles } = useSelector((state: RootState) => state.user);

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (!roles || roles.title !== 'ROLE_ADMIN') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
// Проверить при добавлении ролей