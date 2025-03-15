import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

interface User {
  id: number;
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<User>;
  register: (data: { email: string; username: string; password: string }) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authCheckTimestamp, setAuthCheckTimestamp] = useState(0);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const userEmail = localStorage.getItem('userEmail');
      
      console.log('AuthContext: Checking authentication status. User email in localStorage:', userEmail);
      
      if (!userEmail) {
        console.log('AuthContext: No user email found in localStorage, user is not authenticated');
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        console.log('AuthContext: Verifying user with backend');
        const userData = await authApi.me();
        console.log('AuthContext: User verification successful:', userData);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('AuthContext: Authentication check failed:', error);
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('userEmail');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [authCheckTimestamp]); // Re-run when this timestamp changes

  const login = async (credentials: { email: string; password: string }) => {
    try {
      console.log('AuthContext: Logging in with credentials', credentials.email);
      const userData = await authApi.login(credentials);
      console.log('AuthContext: Login successful, userData:', userData);
      
      // Set user state
      setUser(userData);
      
      // Set authentication status
      setIsAuthenticated(true);
      
      // Store email in localStorage for persistence
      localStorage.setItem('userEmail', userData.email);
      console.log('AuthContext: Authentication state updated - Authenticated:', true);
      
      // Trigger a re-verification of auth status
      setAuthCheckTimestamp(Date.now());
      
      return userData; // Return the user data for the component
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      // Let the component handle the error
      throw error;
    }
  };

  const register = async (data: { email: string; username: string; password: string }) => {
    try {
      const userData = await authApi.register(data);
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('userEmail', userData.email);
    } catch (error) {
      // Let the component handle the error
      throw error;
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('userEmail');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, isLoading }}>
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