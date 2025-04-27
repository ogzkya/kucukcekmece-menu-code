// frontend/src/components/customer/CategoryCard.jsx
// Kategori kartı bileşeni stili

import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category, restaurantSlug }) => {
  // Türkçe isimleri gösterilen görüntülerdeki gibi büyük harflerle göster
  // const categoryName = category.name.toUpperCase();

  return (
    <Link 
      to={`/tesis/${restaurantSlug}/category/${category._id}`} 
      className="category-card fade-in" 
    >
      <img src={category.imageUrl} alt={category.name} className="category-card-image" />
      <div className="category-card-overlay">
        <h3 className="category-card-title">{category.name}</h3>
        <span className="category-card-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"></path>
          </svg>
        </span>
      </div>
    </Link>
  );
};

export default CategoryCard;