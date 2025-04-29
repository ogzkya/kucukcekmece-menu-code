// frontend/src/components/customer/AddToCartButton.jsx - Devre dışı bırakıldı
/*
import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';

const AddToCartButton = ({ menuItem, isDetail = false }) => {
  const { addToCart, isInCart, getItemQuantity, updateQuantity } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  
  const itemQuantity = getItemQuantity(menuItem._id);
  const isItemInCart = isInCart(menuItem._id);
  
  const handleAddToCart = (e) => {
    // Tıklama olayının, link tıklamasını engellemesini sağla
    if (!isDetail) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    if (isDetail) {
      // Eğer detay sayfasındaysak, notu da ekleyelim
      addToCart(menuItem, quantity, note);
      setQuantity(1);
      setNote('');
      setShowNoteInput(false);
    } else {
      // Ana listedeyken hızlı ekleme
      addToCart(menuItem, 1);
    }
  };
  
  const handleIncrement = (e) => {
    // Tıklama olayının, link tıklamasını engellemesini sağla
    if (!isDetail) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    if (isItemInCart) {
      updateQuantity(menuItem._id, itemQuantity + 1);
    } else {
      setQuantity(prev => prev + 1);
    }
  };
  
  const handleDecrement = (e) => {
    // Tıklama olayının, link tıklamasını engellemesini sağla
    if (!isDetail) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    if (isItemInCart) {
      updateQuantity(menuItem._id, itemQuantity - 1);
    } else if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  // Detay sayfasındaki detaylı buton
  if (isDetail) {
    return (
      <div className="add-to-cart-detail">
        {!isItemInCart ? (
          <>
            <div className="quantity-control">
              <button 
                className="quantity-btn"
                onClick={handleDecrement}
                disabled={quantity <= 1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
              <span className="quantity-value">{quantity}</span>
              <button 
                className="quantity-btn"
                onClick={handleIncrement}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>
            
            {!showNoteInput ? (
              <button 
                className="btn btn-note"
                onClick={() => setShowNoteInput(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Not Ekle
              </button>
            ) : (
              <div className="note-input-container">
                <input
                  type="text"
                  className="note-input"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Özel not ekleyin..."
                  autoFocus
                />
                <button 
                  className="btn btn-note"
                  onClick={() => setShowNoteInput(false)}
                >
                  Tamam
                </button>
              </div>
            )}
            
            <button 
              className="btn btn-add-to-cart"
              onClick={handleAddToCart}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              Sepete Ekle
            </button>
          </>
        ) : (
          <div className="in-cart-controls">
            <div className="quantity-control">
              <button 
                className="quantity-btn"
                onClick={handleDecrement}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
              <span className="quantity-value">{itemQuantity}</span>
              <button 
                className="quantity-btn"
                onClick={handleIncrement}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>
            <span className="in-cart-message">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              Sepette
            </span>
          </div>
        )}
      </div>
    );
  }
  
  // Liste sayfasındaki minimal buton
  return (
    <div className="add-to-cart-button" onClick={(e) => e.stopPropagation()}>
      {!isItemInCart ? (
        <button 
          className="btn add-btn"
          onClick={handleAddToCart}
          aria-label="Sepete Ekle"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      ) : (
        <div className="in-cart-button-group">
          <button 
            className="btn decrement-btn"
            onClick={handleDecrement}
            aria-label="Azalt"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
          <span className="item-quantity">{itemQuantity}</span>
          <button 
            className="btn increment-btn"
            onClick={handleIncrement}
            aria-label="Artır"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};
*/

// Boş bileşen sağlayın ki başka bileşenler hata vermesin
const AddToCartButton = () => null;
const CartButton = () => null;
const Cart = () => null;

export { AddToCartButton, CartButton, Cart };