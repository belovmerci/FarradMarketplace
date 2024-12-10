import React, { useEffect, useState } from 'react';
import { getProducts } from '../services/api';

const ProductsList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Product List</h1>
      <ul>
        {products.map((product: any) => (
          <li key={product.ProductID}>
            {product.Name} - ${product.Price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductsList;
