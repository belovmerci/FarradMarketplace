
import axios from 'axios';
import { getToken } from './auth';

const api = axios.create({
  baseURL: 'http://localhost:3001',
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};

export const addToCart = async (userId: number, productId: number) => {
  const response = await api.post(`/carts/${userId}`, { productId });
  return response.data;
};

export const createOrder = async (orderData: any) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const submitOrder = async (cart: { id: number; quantity: number }[]) => {
  const response = await axios.post('/api/orders', { items: cart });
  return response.data;
};


// Mock payment
export const processPayment = async (amount: number) => {
  // Simulate success
  return { success: true, transactionId: `txn_${Math.floor(Math.random() * 100000)}` };
};
