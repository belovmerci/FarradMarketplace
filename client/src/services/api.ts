import axios from 'axios';
import { getToken } from './auth'; // If you use tokens for authentication

const api = axios.create({
  baseURL: 'http://localhost:3001', // Update baseURL if needed
});

api.interceptors.request.use((config) => {
  const token = getToken(); // Retrieve token if authentication is used
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getProducts = async (filters?: { categoryId?: number; minId?: number; maxId?: number }) => {
  try {
    const params = { ...filters }; // optional filters
    const response = await api.get('/products', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const addToCart = async (userId: number, productId: number) => {
  const response = await api.post(`/carts/${userId}`, { productId });
  return response.data;
};

export const createOrder = async (orderData: any) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

/*
export const submitOrder = async (cart: { id: number; quantity: number }[]) => {
  const response = await axios.post('/api/orders', { items: cart });
  return response.data;
};
*/
export const submitOrder = async (cart: any[], shippingAddressId: number) => {
  const token = localStorage.getItem('authToken'); // Retrieve token from localStorage

  try {
    const response = await api.post(
      '/orders/make-order', // API endpoint
      { cart, shippingAddressId }, // Request body
      {
        headers: {
          Authorization: `Bearer ${token}`, // Send the token for authentication
        },
      }
    );

    return response.data; // Axios response data
  } catch (error: any) {
    console.error('Failed to submit order:', error);
    throw new Error(error.response?.data?.error || 'Failed to submit order');
  }
};

// Fetch shipping addresses from the API
export const getShippingAddresses = async () => {
  const response = await api.get('/shipping');
  return response.data;
};

// Mock payment
export const processPayment = async (amount: number) => {
  // Simulate success
  return { success: true, transactionId: `txn_${Math.floor(Math.random() * 100000)}` };
};
