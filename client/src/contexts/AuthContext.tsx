import React, { createContext, useContext, useState } from 'react';
import { getToken, login, logout as performLogout, register } from '../services/auth';

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, password: string, email: string) => Promise<void>;
}

export const parseToken = (token: string): User => {
  try {
    // Split the token to extract the payload
    const [, payload] = token.split('.');
    if (!payload) throw new Error('Invalid token format');

    // Decode the base64-encoded payload
    const decodedPayload = atob(payload);

    // Parse the JSON payload to extract user info
    const { id, username, email } = JSON.parse(decodedPayload);

    // Return the user object
    return { id, username, email };
  } catch (error) {
    console.error('Failed to parse token:', error);
    throw new Error('Invalid token');
  }
};

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());
  const [user, setUser] = useState<User | null>(null);
  
    const handleLogin = async (username: string, password: string) => {
    const token = await login(username, password);
    setIsAuthenticated(true);
    const userInfo = parseToken(token); // Decode or fetch user info using the token
    setUser(userInfo);
  };

  const handleLogout = () => {
    performLogout();
    setIsAuthenticated(false);
    setUser(null);
  };
  

  const handleRegister = async (username: string, password: string, email: string) => {
    const token = await register(username, password, email);
    setIsAuthenticated(true);
    const userInfo = parseToken(token);
    setUser(userInfo);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login: handleLogin, logout: handleLogout, register: handleRegister }}>
      {children}
    </AuthContext.Provider>
  );
};
  /*
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login: handleLogin,
        logout: handleLogout,
        register: handleRegister,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
  */

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
