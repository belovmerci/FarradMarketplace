import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/general.css';

const OrderConfirmationPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Заказ размещён!</h1>
      <p>Заказ успешно размещён! Надеемся увидеть вас снова!</p>
      <button onClick={() => navigate('/')}>Продолжить покупки</button>
    </div>
  );
};

export default OrderConfirmationPage;
