import react from 'react';
import axios from 'axios';
import { SHA256 } from 'crypto-js';
const api = axios.create({
  baseURL: 'http://localhost:3001', // Backend server URL
  withCredentials: true,
});

export const login = async (username: string, password: string) => {
  const passwordHash = SHA256(password).toString(); // Hash password
  const response = await api.post('/auth/login', { username, passwordHash });
  if (response.data.accessToken) {
    return response.data.accessToken; // Make sure this returns the token
  } else {
    throw new Error('Login failed');
  }
};

export const register = async (username: string, password: string, email: string, role = 'user') => {
  const passwordHash = SHA256(password).toString(); // Hash password
  const response = await api.post('/auth/register', { username, passwordHash, email, role });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getToken = () => localStorage.getItem('token');
