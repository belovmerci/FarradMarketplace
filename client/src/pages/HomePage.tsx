import React, { useEffect, useState } from 'react';
import { useCart } from '../contexts/CartContext';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/api';

interface Product {
  id: number;
  name: string;
  price: number;
}

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Welcome to FarradMarketplace</h1>
      <div>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            onAddToCart={() =>
              addToCart({ id: product.id, name: product.name, price: product.price, quantity: 1 })
            }
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
