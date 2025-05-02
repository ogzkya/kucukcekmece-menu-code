// frontend/src/components/common/SearchBox.jsx - Optimize edilmiş
import React, { memo } from 'react';

const SearchBox = memo(({ value, onChange, placeholder = 'Ara...' }) => {
  // Boş arama için temizleme butonu göstermenin gereği yok
  const showClearButton = value && value.length > 0;
  
  // Aramayı temizleme fonksiyonu
  const handleClear = () => {
    if (onChange) {
      onChange({ target: { value: '' } });
    }
  };
  
  return (
    <div className="search-input-wrapper">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        // Performans için autocomplete kapatılıyor
        autoComplete="off"
      />
      {showClearButton && (
        <button 
          className="search-button"
          onClick={handleClear}
          aria-label="Aramayı temizle"
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}
    </div>
  );
});

// displayName ekleyerek debugging kolaylığı sağlıyoruz
SearchBox.displayName = 'SearchBox';

export default SearchBox;