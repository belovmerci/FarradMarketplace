import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { submitOrder, getShippingAddresses } from '../services/api';
import { useNavigate } from 'react-router-dom';
import '../styles/general.css';

const CheckoutPage = () => {
  const { cart, isAuthenticated } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shippingAddresses, setShippingAddresses] = useState<{ ShippingAddressID: number, Name: string }[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Fetch shipping addresses from API
  useEffect(() => {
    const fetchShippingAddresses = async () => {
      try {
        const addresses = await getShippingAddresses();
        setShippingAddresses(addresses);
      } catch (err) {
        console.error('Failed to fetch shipping addresses:', err);
        setError('Не удалось загрузить адреса. Попробуйте позже.');
      }
    };

    fetchShippingAddresses();
  }, []);

  // Handle checkout
  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!selectedAddress) {
      setError('Пожалуйста, выберите адрес для получения товара.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Submit the order with the selected address
      await submitOrder(cart, selectedAddress);

      setOrderSuccess(true);
    } catch (err) {
      console.error(err);
      setError('Ошибка при обработке заказа. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return <p>Ваша корзина пуста. Добавьте товары в корзину, чтобы оформить заказ.</p>;
  }

  if (orderSuccess) {
    return (
      <div>
        <h1>Заказ успешно оформлен!</h1>
        <p>Ваш заказ был успешно принят. Мы свяжемся с вами для подтверждения.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Оформление заказа</h1>
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

      <div>
        <label htmlFor="shippingAddress">Выберите адрес для получения товара:</label>
        <select
          id="shippingAddress"
          onChange={(e) => setSelectedAddress(Number(e.target.value))}
          value={selectedAddress ?? ''}
        >
          <option value="" disabled>Выберите адрес</option>
          {shippingAddresses.map((address) => (
            <option key={address.ShippingAddressID} value={address.ShippingAddressID}>
              {address.Name}
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleCheckout} disabled={loading}>
        {loading ? 'Обработка...' : 'Оформить заказ'}
      </button>
    </div>
  );
};

export default CheckoutPage;
