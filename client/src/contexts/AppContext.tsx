import React, { createContext, useContext, useState } from 'react';
import { getToken, login, logout as performLogout, register } from '../services/auth';

interface User {
  id: number;
  username: string;
  email: string;
}

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
}
  
interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, password: string, email: string) => Promise<void>;

  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
}

interface CartProviderProps {
    children: React.ReactNode;
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

interface AppProviderProps {
  children: React.ReactNode;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  
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

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      }
      return [...prevCart, item];
    });
    };

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <AppContext.Provider value={{ user, isAuthenticated, cart, login: handleLogin, logout: handleLogout, register: handleRegister, addToCart, removeFromCart, clearCart }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAuth must be used within an AppProvider');
  return context;
};
