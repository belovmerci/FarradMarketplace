import React, { useState } from 'react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const CartPage: React.FC = () => {
  // Dummy cart dat
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: 1, name: 'Mountain Bike', price: 500, quantity: 1 },
    { id: 2, name: 'Road Bike', price: 700, quantity: 2 }
  ]);

  const handleQuantityChange = (id: number, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleCheckout = () => {
    // Placeholder: Implement checkout logic or API call here
    alert('Proceeding to checkout');
  };

  return (
    <div>
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
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