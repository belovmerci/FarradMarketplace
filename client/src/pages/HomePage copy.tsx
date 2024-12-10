import React, { useEffect, useState } from 'react';
import { useApp } from '../contexts/AppContext';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/api';
import '../styles/general.css';

const HomePage = () => {
  interface Product {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    quantity?: number;
  }

  const [products, setProducts] = useState<Product[]>([]);
  const { cart, addToCart, removeFromCart } = useApp();

  const fetchProducts = async () => {
    try {
      const fetchedProducts = await getProducts();
      const formattedProducts = fetchedProducts.map((product: any) => ({
        id: product.ProductID,
        name: product.Name,
        price: product.Price,
        imageUrl: product.ImageUrl,
      }));
      setProducts(formattedProducts);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleQuantityChange = (productId: number, delta: number) => {
    const existingCartItem = cart.find((item) => item.id === productId);
    if (existingCartItem) {
      if (existingCartItem.quantity + delta <= 0) {
        removeFromCart(productId);
      } else {
        addToCart({ ...existingCartItem, quantity: existingCartItem.quantity + delta });
      }
    } else if (delta > 0) {
      const product = products.find((item) => item.id === productId);
      if (product) {
        addToCart({ id: product.id, name: product.name, price: product.price, quantity: delta });
      }
    }
  };

  return (
    <div>
      <div className="products-grid">
        {products.map((product) => {
          const existingCartItem = cart.find((item) => item.id === product.id);
          return (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              imageUrl={product.imageUrl}
              quantity={existingCartItem?.quantity || 0}
              onAddToCart={() => handleQuantityChange(product.id, 1)}
              onRemoveFromCart={() => handleQuantityChange(product.id, -1)}
              isInCart={!!existingCartItem}
            />
          );
        })}
      </div>
    </div>
  );
};

export default HomePage;
