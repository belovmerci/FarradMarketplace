import react from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001', // Backend server URL
});

export const login = async (username: string, password: string) => {
  const response = await api.post('/auth/login', { username, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    return response.data;
  } else {
    throw new Error('Login failed');
  }
};

export const register = async (username: string, password: string, email: string) => {
  const response = await api.post('/auth/register', { username, password, email });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getToken = () => localStorage.getItem('token');
