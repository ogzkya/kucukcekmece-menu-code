// frontend/src/components/customer/CartButton.jsx
import React from 'react';
import { useCart } from '../../context/CartContext';

const CartButton = ({ onClick }) => {
  const { getCartCount, getCartTotal } = useCart();
  
  const itemCount = getCartCount();
  const total = getCartTotal();
  
  if (itemCount === 0) {
    return null; // Sepet boşsa butonu gösterme
  }

  return (
    <button 
      className="floating-cart-btn" 
      onClick={onClick}
      aria-label="Siparişimi Görüntüle"
    >
      <div className="cart-btn-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        <span className="cart-item-count">{itemCount}</span>
      </div>
      <div className="cart-btn-text">
        <span className="cart-btn-label">Siparişimi Görüntüle</span>
        <span className="cart-btn-total">{total.toFixed(2)} ₺</span>
      </div>
    </button>
  );
};

export default CartButton;