import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import { User, RegisterRequest } from '../types/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuth() {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authApi.getCurrentUser();
          setAuthState({
            user: response.data,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          localStorage.removeItem('token');
          setAuthState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } else {
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);
      if (response.data?.token && response.data?.user) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        setAuthState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
        navigate('/');
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    name: string;
    password_confirmation: string;
  }) => {
    try {
      const response = await authApi.register(userData);
      if (response.data?.token && response.data?.user) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        setAuthState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
        navigate('/');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      localStorage.removeItem('token');
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
      navigate('/login');
    } catch (error) {
      throw error;
    }
  };

  return {
    ...authState,
    login,
    register,
    logout,
  };
} 