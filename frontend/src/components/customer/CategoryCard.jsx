// frontend/src/components/customer/CategoryCard.jsx - restaurantSlug propu eklenmiş versiyon
import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category, restaurantSlug }) => {
  return (
    <Link 
      to={`/tesis/${restaurantSlug}/category/${category._id}`} 
      className="category-card" 
      style={{ backgroundImage: `url(${category.imageUrl})` }}
    >
      <div className="category-card-overlay">
        <h2 className="category-card-title">{category.name}</h2>
      </div>
    </Link>
  );
};

export default CategoryCard;