import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div>
      <h1>Welcome to FarradMarketplace</h1>
      <p>Your one-stop shop for premium bicycles and more!</p>
      <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
    </div>
  );
};

export default HomePage;
