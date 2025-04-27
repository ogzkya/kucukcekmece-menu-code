// frontend/src/components/customer/MenuItemCard.jsx - Modern tasarıma güncellenmiş versiyon
import React from 'react';
import { Link } from 'react-router-dom';

const MenuItemCard = ({ menuItem, restaurantSlug }) => {
  // Metin kısaltma fonksiyonu
  const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <div className="menu-item-card fade-in">
      <Link to={`/tesis/${restaurantSlug}/item/${menuItem._id}`} className="menu-item-image-container">
        <img 
          src={menuItem.imageUrl} 
          alt={menuItem.name} 
          className="menu-item-image" 
        />
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
        
        <div className="d-flex justify-content-between align-items-center mt-auto">
          <div className="menu-item-price">
            {menuItem.price > 0 ? `${menuItem.price.toFixed(2)} ₺` : ''}
          </div>
          
          {menuItem.weight && (
            <div className="menu-item-weight">
              {menuItem.weight}
            </div>
          )}
        </div>
        
        {menuItem.allergens && menuItem.allergens.length > 0 && (
          <div className="menu-item-allergens mt-2">
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
};

export default MenuItemCard;