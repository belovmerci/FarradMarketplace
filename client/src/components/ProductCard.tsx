import React from 'react';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  onAddToCart: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, name, price, onAddToCart }) => {
  return (
    <div>
      <h3>{name}</h3>
      <p>Price: ${price}</p>
      <button onClick={() => onAddToCart(id)}>Add to Cart</button>
    </div>
  );
};

export default ProductCard;
