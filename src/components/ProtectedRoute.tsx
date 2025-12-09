import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('admin' | 'employee')[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Treat department heads (admin role with head/dean/principal titles) like employees for route access
  const isDepartmentHead =
    user?.role === 'admin' &&
    user?.position &&
    (user.position.toLowerCase().includes('head') ||
      user.position.toLowerCase().includes('dean') ||
      user.position.toLowerCase().includes('principal') ||
      user.position.toLowerCase().includes('chairman') ||
      user.position.toLowerCase().includes('president'));

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const fallbackPath = user?.role === 'admin' ? '/dashboard' : '/employee/dashboard';

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Allow department heads to pass through employee-only routes
    if (isDepartmentHead && allowedRoles.includes('employee')) {
      return <>{children}</>;
    }

    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
