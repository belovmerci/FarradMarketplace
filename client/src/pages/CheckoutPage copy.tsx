import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { submitOrder } from '../services/api';
import { useNavigate } from 'react-router-dom';
import '../styles/general.css';

const CheckoutPage = () => {
  const { cart, isAuthenticated } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

const handleCheckout = async () => {
  if (!isAuthenticated) {
    navigate('/login');
    return;
  }

  try {
    setLoading(true);
    setError(null);

    const shippingAddressId = 1;
    await submitOrder(cart, shippingAddressId);

    navigate('/orders/make-order');
  } catch (err) {
    console.error(err);
    setError('Order processing failed. Please try again later.');
  } finally {
    setLoading(false);
  }
};

  if (cart.length === 0) {
    return <p>Your cart is empty. Add items to your cart before checking out.</p>;
  }

  return (
    <div>
      <h1>Checkout</h1>
      <ul>
        {cart.map((item) => (
          <li key={item.id}>
            {item.name} - ${item.price} x {item.quantity}
          </li>
        ))}
      </ul>
      <p>
        <strong>Сумма:</strong> $
        {cart.reduce((total, item) => total + item.price * item.quantity, 0)}
      </p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleCheckout} disabled={loading}>
        {loading ? 'Обработка...' : 'Оформить заказ'}
      </button>
    </div>
  );
};

export default CheckoutPage;
