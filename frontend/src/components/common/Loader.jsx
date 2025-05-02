// frontend/src/components/common/Loader.jsx - Modern tasarıma güncellenmiş versiyon
import React from 'react';

const Loader = ({ size = 'md', text = 'Yükleniyor...' }) => {
  // Boyut değerlerini belirle
  const sizeValues = {
    sm: { loaderSize: '30px', fontSize: '14px' },
    md: { loaderSize: '48px', fontSize: '16px' },
    lg: { loaderSize: '64px', fontSize: '18px' }
  };
  
  const { loaderSize, fontSize } = sizeValues[size] || sizeValues.md;

  return (
    <div className="loader-container">
      <div className="loader-content">
        <div 
          className="loader" 
          style={{ width: loaderSize, height: loaderSize }}
          aria-hidden="true"
        ></div>
        {text && (
          <p 
            className="loader-text mt-3" 
            style={{ fontSize }}
          >
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

export default Loader;