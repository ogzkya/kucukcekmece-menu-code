// frontend/src/components/customer/CategoryCard.jsx - Modern tasarıma güncellenmiş versiyon
import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category, restaurantSlug }) => {
  // Görsel efekti için kullanılacak arka plan gradient'i
  const overlayGradient = `linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.2) 0%,
    rgba(0, 0, 0, 0.7) 100%
  )`;

  return (
    <Link 
      to={`/tesis/${restaurantSlug}/category/${category._id}`} 
      className="category-card fade-in" 
      style={{ 
        backgroundImage: `${overlayGradient}, url(${category.imageUrl})` 
      }}
    >
      <div className="category-card-overlay">
        <div className="category-card-content">
          <h2 className="category-card-title">{category.name}</h2>
          <div className="category-card-icon">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;