// frontend/src/components/customer/MenuItemCard.jsx - React.memo ile optimize edilmiş
import React, { memo } from 'react';
import { Link } from 'react-router-dom';

// Metin kısaltma fonksiyonu
const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Fiyat biçimlendirme
const formatPrice = (price) => {
  if (typeof price !== 'number') return '';
  return price.toFixed(2);
};

const MenuItemCard = memo(({ menuItem, restaurantSlug }) => {
  return (
    <div className="menu-item-card">
      <Link to={`/tesis/${restaurantSlug}/item/${menuItem._id}`} className="menu-item-image-container">
        <img 
          src={menuItem.imageUrl} 
          alt={menuItem.name} 
          className="menu-item-image" 
          loading="lazy" 
          width="300"
          height="200"
        />
        {menuItem.price > 0 && (
          <div className="menu-item-price-tag">
            {formatPrice(menuItem.price)} ₺
          </div>
        )}
      </Link>
      
      <div className="menu-item-content">
        <Link to={`/tesis/${restaurantSlug}/item/${menuItem._id}`}>
          <h3 className="menu-item-title">{menuItem.name}</h3>
        </Link>
        
        {menuItem.description && (
          <p className="menu-item-description">
            {truncateText(menuItem.description, 80)}
          </p>
        )}
        
        <div className="menu-item-meta">
          {menuItem.weight && (
            <div className="menu-item-weight">
              {menuItem.weight}
            </div>
          )}
          
          <Link to={`/tesis/${restaurantSlug}/item/${menuItem._id}`} className="view-details">
            Detaylar
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </Link>
        </div>
        
        {menuItem.allergens && menuItem.allergens.length > 0 && (
          <div className="menu-item-allergens">
            {menuItem.allergens.slice(0, 2).map((allergen, index) => (
              <span key={index} className="menu-item-allergen">
                {allergen}
              </span>
            ))}
            {menuItem.allergens.length > 2 && (
              <span className="menu-item-allergen-more">+{menuItem.allergens.length - 2}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

// displayName ekleyerek debugging kolaylığı sağlıyoruz
MenuItemCard.displayName = 'MenuItemCard';

export default MenuItemCard;