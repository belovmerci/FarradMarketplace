import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/api';
import '../styles/general.css';

const HomePage = () => {
  const { cart, addToCart, removeFromCart } = useApp(); // Use cart functions from context

  // Product type is derived from AppContext cart item structure for consistency
  interface Product {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]); // For search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [sortAscending, setSortAscending] = useState(true);

  useEffect(() => {
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
        setDisplayedProducts(formattedProducts); // Initial display
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Handle search functionality
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);
    setDisplayedProducts(
      products.filter((product) =>
        product.name.toLowerCase().includes(searchValue)
      )
    );
  };

  // Toggle sorting by price
  const toggleSortByPrice = () => {
    const sortedProducts = [...displayedProducts].sort((a, b) =>
      sortAscending ? a.price - b.price : b.price - a.price
    );
    setSortAscending(!sortAscending);
    setDisplayedProducts(sortedProducts);
  };

  return (
    <div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        <button onClick={toggleSortByPrice}>
          Sort by Price: {sortAscending ? 'Ascending' : 'Descending'}
        </button>
      </div>
      <div className="products-grid">
        {displayedProducts.map((product) => {
          // Find product quantity from the cart
          const cartItem = cart.find((item) => item.id === product.id);
          const quantity = cartItem ? cartItem.quantity : 0;

          return (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              imageUrl={product.imageUrl}
              quantity={quantity}
              onAddToCart={() => addToCart({ ...product, quantity: 1 })} // Add 1 to cart
              onRemoveFromCart={() => removeFromCart(product.id)} // Remove 1 from cart
              isInCart={!!cartItem}
            />
          );
        })}
      </div>
    </div>
  );
};

export default HomePage;
