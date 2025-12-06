import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on role
  let dashboardPath = '/employee/dashboard';
  if (user.role === 'admin') {
    dashboardPath = '/dashboard';
  } else if (user.role === 'guard') {
    dashboardPath = '/guard/dashboard';
  }

  return <Navigate to={dashboardPath} replace />;
};

export default Index;
