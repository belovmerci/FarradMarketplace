import React, { createContext, useContext, useState } from 'react';
import { getToken, login, logout as performLogout, register } from '../services/auth';
import { fetchUserDetails } from '../services/user'; // Add a new service for user details

interface User {
  username: string;
  userId: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null; // Add user details
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
  const [user, setUser] = useState<User | null>(null); // User state

  const handleLogin = async (username: string, password: string) => {
    await login(username, password);
    setIsAuthenticated(true);
    const userDetails = await fetchUserDetails(); // Fetch user details after login
    setUser(userDetails);
  };

  const handleLogout = () => {
    performLogout();
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleRegister = async (username: string, password: string, email: string) => {
    await register(username, password, email);
    setIsAuthenticated(true);
    const userDetails = await fetchUserDetails(); // Fetch user details after registration
    setUser(userDetails);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login: handleLogin, logout: handleLogout, register: handleRegister }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
