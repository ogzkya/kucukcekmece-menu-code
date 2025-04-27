// frontend/src/components/common/Header.jsx - Header component
import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ title = 'Küçükçekmece Belediyesi QR Menü' }) => {
  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/">
          <img 
            src="./public/logokc.png" 
            alt="Küçükçekmece Belediyesi Logo" 
            className="logo" 
          />
        </Link>
        <h1 className="sr-only">{title}</h1>
      </div>
    </header>
  );
};

export default Header