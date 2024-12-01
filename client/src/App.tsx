import React from 'react';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';

import Header from './components/Header';

import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import RegisterPage from './pages/RegisterPage';

import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';

const App = () => {
  return (
      <CartProvider>
        <AuthProvider>

        <BrowserRouter>
        <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
          </Routes>
        </BrowserRouter>

      </AuthProvider>
    </CartProvider>
  );
};

export default App;
