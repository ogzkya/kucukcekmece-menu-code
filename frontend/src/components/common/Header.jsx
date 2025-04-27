// frontend/src/components/common/Header.jsx - Düzeltilmiş header

import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ title = 'Küçükçekmece Belediyesi QR Menü', showBackButton, backTo }) => {
  return (
    <header className="header">
      <div className="container header-inner">
        {showBackButton ? (
          <button onClick={() => window.history.back()} className="back-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Geri
          </button>
        ) : (
          <div className="header-logo">
            <Link to="/">
              <img 
                src="/assets/logo.png" 
                alt="Küçükçekmece Belediyesi Logo" 
                className="logo" 
              />
            </Link>
          </div>
        )}
        
        <div className="header-content">
          <h1 className="header-title">{title}</h1>
        </div>
        
        <div className="language-selector">
          <select defaultValue="tr" className="language-select">
            <option value="tr">Türkçe</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>
    </header>
  );
};

export default Header;
