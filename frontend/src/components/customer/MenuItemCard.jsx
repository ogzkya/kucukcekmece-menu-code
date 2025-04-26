import React from 'react';
import { Link } from 'react-router-dom';

const MenuItemCard = ({ menuItem, restaurantSlug }) => {
  return (
    <div className="menu-item-card">
      <Link to={`/tesis/${restaurantSlug}/item/${menuItem._id}`}>
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
        <p className="menu-item-description">
          {menuItem.description.length > 100 
            ? `${menuItem.description.substring(0, 100)}...` 
            : menuItem.description}
        </p>
        <div className="d-flex justify-content-between align-items-center mt-2">
          <div className="menu-item-price">
            {menuItem.price > 0 ? `${menuItem.price.toFixed(2)} ₺` : ''}
          </div>
          {menuItem.weight && (
            <div className="menu-item-weight">{menuItem.weight}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;