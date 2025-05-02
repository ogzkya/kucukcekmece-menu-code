// frontend/src/components/common/Loader.jsx - Optimize edilmiş
import React, { memo } from 'react';

const Loader = memo(({ size = 'md', text = 'Yükleniyor...' }) => {
  // Boyut değerlerini sabit bir obje olarak tanımla - her render'da yeniden oluşturulmasını engelle
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
});

// DisplayName debugging için
Loader.displayName = 'Loader';

export default Loader;