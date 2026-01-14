import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { apiService } from '@/services/api';
import { toast } from 'sonner';
import { User } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('authToken');
      if (token) {
        setIsAuthenticated(true);
        const userData = localStorage.getItem('adminUser');
        if (userData) {
          try {
            setUser(JSON.parse(userData));
          } catch (error) {
            console.error('Failed to parse user data');
          }
        } else {
          setUser({ id: 'user', email: 'admin@example.com', role: 'admin', is_admin: true });
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiService.auth.login(email, password);
      localStorage.setItem('adminToken', response.token);
      localStorage.setItem('adminUser', JSON.stringify(response.user));
      setUser(response.user);
      setIsAuthenticated(true);
      toast.success('Logged in successfully');
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiService.auth.register(email, password);
      localStorage.setItem('adminToken', response.token);
      localStorage.setItem('adminUser', JSON.stringify(response.user));
      setUser(response.user);
      setIsAuthenticated(true);
      toast.success('Registered successfully');
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    apiService.auth.logout();
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, login, register, logout }}>
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
