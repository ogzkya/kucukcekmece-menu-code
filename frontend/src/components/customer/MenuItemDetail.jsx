// frontend/src/components/customer/MenuItemDetail.jsx - Menu item detail modal
import React from 'react';

const MenuItemDetail = ({ menuItem }) => {
  if (!menuItem) return null;

  return (
    <div className="menu-item-detail">
      <img 
        src={menuItem.imageUrl} 
        alt={menuItem.name} 
        className="menu-item-detail-image" 
      />
      <div className="menu-item-detail-content">
        <h2 className="menu-item-detail-title">{menuItem.name}</h2>
        <p className="menu-item-detail-description">{menuItem.description}</p>
        
        {menuItem.price > 0 && (
          <div className="menu-item-detail-price">
            {menuItem.price.toFixed(2)} ₺
            {menuItem.weight && (
              <span className="menu-item-weight"> / {menuItem.weight}</span>
            )}
          </div>
        )}
        
        {menuItem.allergens && menuItem.allergens.length > 0 && (
          <div className="menu-item-detail-allergens">
            <h4 className="mb-2">Alerjenler:</h4>
            <div>
              {menuItem.allergens.map((allergen, index) => (
                <span key={index} className="menu-item-detail-allergen">
                  {allergen}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuItemDetail;