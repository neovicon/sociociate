import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Don't protect login or register routes
  if (location.pathname === '/login' || location.pathname === '/register') {
    return children;
  }

  if (loading) {
    return <Spinner />; // spinner while auth status loads
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
