import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  return (
    <header className="header">
      <nav className="header-nav">
        <Link to="/" className="header-link">
        <img src="dutchbike192.png" height={48} width={48}/>
         FarradMarketplace
         </Link>
         <div/>
         <div/>
         <div/>
         <div/>
         <div/>
        <Link to="/cart" className="header-link">Корзина 🛒</Link>
        <Link to="/login" className="header-link">Авторизация 🔑</Link>
      </nav>
    </header>
  );
};

export default Header;
