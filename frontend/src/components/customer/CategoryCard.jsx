// frontend/src/components/customer/CategoryCard.jsx - Optimize edilmiş
import React, { memo } from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = memo(({ category, restaurantSlug }) => {
  return (
    <Link 
      to={`/tesis/${restaurantSlug}/category/${category._id}`} 
      className="category-card" 
    >
      <img 
        src={category.imageUrl} 
        alt={category.name} 
        className="category-card-image"
        loading="lazy" 
        width="400"
        height="180"
      />
      <div className="category-card-overlay">
        <h3 className="category-card-title">{category.name}</h3>
      </div>
    </Link>
  );
});

// DisplayName debugging için
CategoryCard.displayName = 'CategoryCard';

export default CategoryCard;