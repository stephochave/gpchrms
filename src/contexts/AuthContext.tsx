import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL, getConnectionErrorMessage } from '@/lib/api';
import { apiFetch } from '@/lib/fetch';

interface User {
  id: string;
  username: string;
  role: 'admin' | 'employee' | 'guard';
  employeeId?: string | null;
  fullName: string;
  email?: string;
  position?: string | null;
  department?: string | null;
  token?: string;
  passwordResetRequired?: boolean;
}

interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  try {
    const storedUser = localStorage.getItem('hrms_user');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [isLoading, setIsLoading] = useState(true);

  // Verify user status on mount and periodically
  useEffect(() => {
    const verifyUserStatus = async () => {
      const storedUser = getStoredUser();
      if (!storedUser || !storedUser.employeeId) {
        setIsLoading(false);
        return;
      }

      try {
        // Check if employee is still active
        const response = await apiFetch(
          `${API_BASE_URL}/employees?employeeId=${storedUser.employeeId}`
        );
        
        if (response.ok) {
          const data = await response.json();
          const employee = data.data?.[0];
          
          // If employee is inactive, log them out
          if (employee && employee.status === 'inactive') {
            setUser(null);
            localStorage.removeItem('hrms_user');
            localStorage.removeItem('hrms_token');
            setIsLoading(false);
            return;
          }
        }
      } catch (error) {
        console.error('Error verifying user status:', error);
        // Continue with stored user if verification fails
      }

      setUser(storedUser);
      setIsLoading(false);
    };

    verifyUserStatus();
  }, []);

  const login = async (usernameOrEmailOrEmpId: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await apiFetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          identifier: usernameOrEmailOrEmpId,
          password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        return {
          success: false,
          message: data?.message || 'Invalid credentials',
        };
      }

      const userData: User = {
        id: String(data.user.id),
        username: data.user.username,
        role: data.user.role,
        employeeId: data.user.employeeId,
        fullName: data.user.fullName,
        email: data.user.email,
        position: data.user.position || null,
        department: data.user.department || null,
        token: data.token,
        passwordResetRequired: data.user.passwordResetRequired || false,
      };

      setUser(userData);
      localStorage.setItem('hrms_user', JSON.stringify(userData));
      localStorage.setItem('hrms_token', data.token);

      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error', error);
      const errorMessage = error instanceof TypeError && error.message.includes('fetch')
        ? getConnectionErrorMessage()
        : 'Unable to reach the server. Please try again.';
      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hrms_user');
    localStorage.removeItem('hrms_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
