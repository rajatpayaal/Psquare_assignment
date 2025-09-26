import { Navigate } from 'react-router-dom';
import { useAuth } from '../store/authContext.jsx';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, isAuthenticated } = useAuth();

  // Support both boolean and function style isAuthenticated
  const authed = typeof isAuthenticated === 'function' ? isAuthenticated() : !!isAuthenticated;

  if (!authed) return <Navigate to="/login" replace />;
  if (requiredRole && user?.role !== requiredRole) return <Navigate to="/" replace />;
  return children;
}
