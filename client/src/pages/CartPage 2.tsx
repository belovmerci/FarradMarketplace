import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/general.css';

const CartPage: React.FC = () => {
  interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
  }
  
  // Dummy cart data
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: 1, name: 'Mountain Bike', price: 500, quantity: 1 },
    { id: 2, name: 'Road Bike', price: 700, quantity: 2 }
  ]);
  const navigate = useNavigate();

  const handleQuantityChange = (id: number, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div>
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>В корзине пусто, и ей одиноко! Добавьте в неё товаров <link href='/'>На главную</link></p>
      ) : (
        <div>
          {cartItems.map(item => (
            <div key={item.id}>
              <h4>{item.name}</h4>
              <p>Price: ${item.price}</p>
              <input
                type="number"
                value={item.quantity}
                min="1"
                onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
              />
              <p>Subtotal: ${item.price * item.quantity}</p>
            </div>
          ))}
          <button onClick={handleCheckout}>Checkout</button>
        </div>
      )}
    </div>
  );
};

export default CartPage;