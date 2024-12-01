import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { submitOrder } from '../services/api';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const { cart } = useCart();
  const { isAuthenticated } = useAuth();
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

      // Call the API to submit the order
      await submitOrder(cart);

      navigate('/order-confirmation');
    } catch (err) {
      console.error(err);
      setError('Заказ не был обработан. Пожалуйста, попробуйте снова позже.');
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
        {loading ? 'Обработка...' : 'Разместить заказ'}
      </button>
    </div>
  );
};

export default CheckoutPage;
