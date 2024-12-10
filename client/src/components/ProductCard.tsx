import React from 'react';
import '../styles/general.css';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  onAddToCart: (id: number) => void;
  onRemoveFromCart: (id: number) => void;
  isInCart: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  imageUrl,
  quantity,
  onAddToCart,
  onRemoveFromCart,
  isInCart
}) => {
  return (
    <div className="product-card">
      <div className="product-card-image">
        <img src={imageUrl} alt={name} />
      </div>
      <div className="product-card-details">
        <h3>{name}</h3>
        <p>Цена: {price}руб</p>
        <p>В корзине: {quantity}</p>
        <div className="product-card-buttons">

            <button onClick={() => onAddToCart(id)}>Add to Cart</button>
            {quantity > 0 && (
            <button onClick={() => onRemoveFromCart(id)}>Remove from Cart</button>
          )}
         </div>
      </div>
    </div>
  );
};

export default ProductCard;
