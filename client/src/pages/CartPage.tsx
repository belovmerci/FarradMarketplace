import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/general.css';

const CartPage: React.FC = () => {
  interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
  }

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const navigate = useNavigate();

  // Load cart items from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart);
        } else {
          console.error('Неверные данные корзины в localStorage');
        }
      } catch (error) {
        console.error('Не удалось обработать данные корзины:', error);
      }
    }
  }, []);

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const handleQuantityChange = (id: number, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(quantity, 1) } : item
      )
    );
  };

  const handleRemoveItem = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart'); // Clear cart data from localStorage
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Ваша корзина пуста!');
      return;
    }
    navigate('/checkout');
  };

  const calculateTotalPrice = () => {
    return cartItems
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
      .toFixed(2);
  };

  return (
    <div>
      <h2>Ваша корзина</h2>
      {cartItems.length === 0 ? (
        <p>
          Ваша корзина пуста. Добавьте что-нибудь!{' '}
          <a href="/">Вернуться в магазин</a>
        </p>
      ) : (
        <>
          <div>
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <h4>{item.name}</h4>
                <p>Цена: {item.price} ₽</p>
                <input
                  type="number"
                  value={item.quantity}
                  min="1"
                  onChange={(e) =>
                    handleQuantityChange(item.id, Number(e.target.value))
                  }
                />
                <p>Сумма: {(item.price * item.quantity).toFixed(2)} ₽</p>
                <button onClick={() => handleRemoveItem(item.id)}>Удалить</button>
              </div>
            ))}
          </div>
          <h3>Общая сумма: {calculateTotalPrice()} ₽</h3>
          <button onClick={handleCheckout}>Перейти к оплате</button>
          <button onClick={handleClearCart} style={{ marginLeft: '10px' }}>
            Очистить корзину
          </button>
        </>
      )}
    </div>
  );
};

export default CartPage;
