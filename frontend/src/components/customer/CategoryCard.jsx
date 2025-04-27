// Kategori Kartı Bileşeni Güncellemesi
// frontend/src/components/customer/CategoryCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category, restaurantSlug }) => {
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
      />
      <div className="category-card-overlay">
        <h3 className="category-card-title">{category.name}</h3>
      </div>
    </Link>
  );
};

export default CategoryCard;