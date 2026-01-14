import { useState, useCallback, useEffect } from 'react';
import { apiService } from '@/services/api';
import { toast } from 'sonner';

interface AuthUser {
  id: string;
  email: string;
  isAdmin: boolean;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
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
        const userData = localStorage.getItem('adminUser');
        if (!userData && token) {
          setUser({ id: 'user', email: 'admin@example.com', isAdmin: true });
        }
      }
    }
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

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
  };
};
