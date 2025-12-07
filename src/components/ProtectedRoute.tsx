import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/fetch';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('admin' | 'employee' | 'guard')[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [isCheckingStatus, setIsCheckingStatus] = React.useState(true);
  const [userStatus, setUserStatus] = React.useState<'active' | 'inactive' | null>(null);

  // Check user status if they have an employeeId
  React.useEffect(() => {
    const checkUserStatus = async () => {
      if (!user?.employeeId) {
        setIsCheckingStatus(false);
        return;
      }

      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
        const response = await apiFetch(
          `${API_BASE_URL}/employees?employeeId=${user.employeeId}`
        );
        
        if (response.ok) {
          const data = await response.json();
          const employee = data.data?.[0];
          
          if (employee) {
            setUserStatus(employee.status);
            
            // If inactive, log out and redirect
            if (employee.status === 'inactive') {
              logout();
              setIsCheckingStatus(false);
              return;
            }
          }
        }
      } catch (error) {
        console.error('Error checking user status:', error);
        // Continue if check fails (don't block access)
      }
      
      setIsCheckingStatus(false);
    };

    if (user && isAuthenticated) {
      checkUserStatus();
    } else {
      setIsCheckingStatus(false);
    }
  }, [user, isAuthenticated, logout]);

  if (isLoading || isCheckingStatus) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If user status is inactive, redirect to login
  if (userStatus === 'inactive') {
    return <Navigate to="/login" replace />;
  }

  const fallbackPath = user?.role === 'admin' ? '/dashboard' : '/employee/dashboard';

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
