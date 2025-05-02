// frontend/src/components/customer/RestaurantCard.jsx - Optimize edilmiş
import React, { memo } from 'react';
import { Link } from 'react-router-dom';

const RestaurantCard = memo(({ restaurant }) => {
  // Tesiste görsel olup olmadığını kontrol et
  const hasImage = Boolean(restaurant.imageUrl);
  
  return (
    <Link to={`/tesis/${restaurant.slug}`} className="facility-card">
      <div className="facility-image-container">
        {hasImage ? (
          <img 
            src={restaurant.imageUrl} 
            alt={restaurant.name} 
            className="facility-image" 
            loading="lazy"
            width="400"
            height="180"
          />
        ) : (
          <div className="facility-image-placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          </div>
        )}
      </div>
      
      <div className="facility-content">
        <h3 className="facility-title">{restaurant.name}</h3>
        
        <div className="facility-address">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span>{restaurant.address}</span>
        </div>
        
        {restaurant.description && (
          <p className="facility-description">{restaurant.description}</p>
        )}
        
        <div className="facility-type-badge mt-2">
          <span className={`badge ${restaurant.facilityType === 'retirement' ? 'bg-info' : 'bg-primary'}`}>
            {restaurant.facilityType === 'retirement' ? 'Emekliler Cafesi' : 'Sosyal Tesis'}
          </span>
        </div>
        
        <div className="facility-action">
          <span className="facility-button">
            Menüyü Görüntüle
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
});

// DisplayName debugging için
RestaurantCard.displayName = 'RestaurantCard';

export default RestaurantCard;