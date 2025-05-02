// frontend/src/components/common/Header.jsx - Optimize edilmiş
import React, { memo } from 'react';
import { Link } from 'react-router-dom';

const Header = memo(({ title = 'Küçükçekmece Belediyesi Sosyal Tesisler', showBackButton, backTo }) => {
  // Click handler'ı useCallback ile sarmaya gerek yok - bileşen zaten memo ile optimize edilmiş
  const handleBackClick = () => window.history.back();
  
  return (
    <header className="header">
      <div className="container header-inner">
        {showBackButton ? (
          <button onClick={handleBackClick} className="back-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Geri
          </button>
        ) : (
          <div className="header-logo-container">
            <Link to="/" className="header-logo-link">
              <img 
                src="/logo2.png" 
                alt="Küçükçekmece Belediyesi" 
                className="header-logo"
                width="150"
                height="125"
              />
            </Link>
          </div>
        )}
        
        <div className="header-title-container">
          
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
});

// DisplayName debugging için
Header.displayName = 'Header';

export default Header