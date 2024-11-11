import React, { createContext, useContext, useEffect, useState } from 'react';
import { getToken, login, logout as performLogout, register } from '../services/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, password: string, email: string) => Promise<void>;
}

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());
  
  const handleLogin = async (username: string, password: string) => {
    await login(username, password);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    performLogout();
    setIsAuthenticated(false);
  };

  const handleRegister = async (username: string, password: string, email: string) => {
    await register(username, password, email);
    setIsAuthenticated(true);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login: handleLogin, logout: handleLogout, register: handleRegister }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
