import React from 'react';
import { useNavigate } from 'react-router-dom';

const OrderConfirmationPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Order Confirmed!</h1>
      <p>Your order has been successfully placed. Thank you for shopping with us!</p>
      <button onClick={() => navigate('/')}>Continue Shopping</button>
    </div>
  );
};

export default OrderConfirmationPage;
