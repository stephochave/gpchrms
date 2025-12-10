import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/fetch';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('admin' | 'employee' | 'guard')[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  // ----- Core auth context -----
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  // ----- Local state for employee status check -----
  const [isCheckingStatus, setIsCheckingStatus] = React.useState(true);
  const [userStatus, setUserStatus] = React.useState<'active' | 'inactive' | null>(null);

  // ----- Department head role override -----
  const isDepartmentHead =
    user?.role === 'admin' &&
    user?.position &&
    ['head', 'dean', 'principal', 'chairman', 'president'].some((rank) =>
      user.position.toLowerCase().includes(rank)
    );

  // ----- Status validation -----
  React.useEffect(() => {
    const checkUserStatus = async () => {
      if (!user?.employeeId) {
        setIsCheckingStatus(false);
        return;
      }

      try {
        const API_BASE_URL =
          import.meta.env.VITE_API_URL || 'http://localhost:4000';

        const response = await apiFetch(
          `${API_BASE_URL}/employees?employeeId=${user.employeeId}`
        );

        if (response.ok) {
          const data = await response.json();
          const employee = data.data?.[0];

          if (employee) {
            setUserStatus(employee.status);

            if (employee.status === 'inactive') {
              logout();
              setIsCheckingStatus(false);
              return;
            }
          }
        }
      } catch (err) {
        console.error('Error checking user status:', err);
      }

      setIsCheckingStatus(false);
    };

    if (user && isAuthenticated) {
      checkUserStatus();
    } else {
      setIsCheckingStatus(false);
    }
  }, [user, isAuthenticated, logout]);

  // ----- Unified loading gate -----
  if (isLoading || isCheckingStatus) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // ----- Hard access gate -----
  if (!isAuthenticated || userStatus === 'inactive') {
    return <Navigate to="/login" replace />;
  }

  // ----- Fall back route -----
  const fallbackPath =
    user?.role === 'admin' ? '/dashboard' : '/employee/dashboard';

  // ----- Role-based gating -----
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Department heads gain access to employee routes
    if (isDepartmentHead && allowedRoles.includes('employee')) {
      return <>{children}</>;
    }

    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
