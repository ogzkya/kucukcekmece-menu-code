// frontend/src/components/customer/Cart.jsx - Siparişi Tamamlama Onay Adımı Eklenmiş
import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';

const Cart = ({ onClose }) => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotal,
    orderNote,
    setOrderNote,
    tableNumber,
    setTableNumber,
    updateItemNote
  } = useCart();
  
  const [showOrderNotes, setShowOrderNotes] = useState(false);
  const [showTableInput, setShowTableInput] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [itemNote, setItemNote] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Sepet boş mu kontrol et
  const isCartEmpty = cartItems.length === 0;
  
  // Toplam tutarı hesapla
  const total = getCartTotal();
  
  // Sepeti temizle
  const handleClearCart = () => {
    if (window.confirm('Sipariş listeniz temizlenecek, emin misiniz?')) {
      clearCart();
    }
  };
  
  // Sipariş tamamlama onayı göster
  const handleCompleteOrderClick = () => {
    setShowConfirmation(true);
  };
  
  // Siparişi tamamla
  const handleCompleteOrder = () => {
    // Sipariş listesini oluştur
    const orderSummary = cartItems.map(item => {
      return `${item.quantity}x ${item.name}${item.notes ? ' (Not: ' + item.notes + ')' : ''}`;
    }).join('\n');
    
    // Sipariş Notu
    const noteText = orderNote ? `\n\nSipariş Notu: ${orderNote}` : '';
    
    // Masa Numarası
    const tableText = tableNumber ? `\nMasa: ${tableNumber}` : '';
    
    // Toplam Tutar
    const totalText = `\n\nToplam: ${total.toFixed(2)} ₺`;
    
    // Siparişi göster
    alert('Siparişiniz hazır! Garsona aşağıdaki bilgileri gösterebilirsiniz:\n\n' + 
          orderSummary + 
          tableText +
          noteText + 
          totalText);
    
    // Sepeti temizle
    clearCart();
    
    // Onay mesajını kapat
    setShowConfirmation(false);
  };
  
  // Onay mesajını kapat
  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
  };
  
  // Ürün notu düzenleme
  const startEditingItemNote = (itemId, currentNote) => {
    setEditingItemId(itemId);
    setItemNote(currentNote || '');
  };
  
  // Ürün notu kaydetme
  const saveItemNote = () => {
    if (editingItemId) {
      updateItemNote(editingItemId, itemNote);
      setEditingItemId(null);
      setItemNote('');
    }
  };

  return (
    <div className="cart-overlay">
      <div className="cart-content">
        {showConfirmation ? (
          // Siparişi tamamlama onay ekranı
          <div className="cart-confirmation">
            <div className="cart-confirmation-header">
              <h2 className="cart-title">Siparişi Tamamla</h2>
              <button className="cart-close-btn" onClick={handleCancelConfirmation} aria-label="Kapat">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="cart-confirmation-body">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="confirmation-icon">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <p className="confirmation-text">Siparişinizi tamamlamak ve sepeti temizlemek istediğinize emin misiniz?</p>
              <div className="confirmation-actions">
                <button 
                  className="btn btn-outline"
                  onClick={handleCancelConfirmation}
                >
                  Vazgeç
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleCompleteOrder}
                >
                  Evet, Tamamla
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="cart-header">
              <h2 className="cart-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                Sipariş Listem
              </h2>
              <button className="cart-close-btn" onClick={onClose} aria-label="Kapat">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="cart-info">
              {!showTableInput ? (
                <div className="cart-table-number" onClick={() => setShowTableInput(true)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="3" y1="9" x2="21" y2="9"></line>
                    <line x1="9" y1="21" x2="9" y2="9"></line>
                  </svg>
                  <span>{tableNumber ? `Masa: ${tableNumber}` : 'Masa numarası ekle'}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                  </svg>
                </div>
              ) : (
                <div className="cart-table-input">
                  <input
                    type="text"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="Masa numarası girin"
                    autoFocus
                  />
                  <button onClick={() => setShowTableInput(false)}>
                    Kaydet
                  </button>
                </div>
              )}
            </div>
            
            {isCartEmpty ? (
              <div className="empty-cart">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <p>Henüz sepetinizde ürün bulunmuyor.</p>
                <button className="btn btn-primary" onClick={onClose}>
                  Menüye Dön
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cartItems.map((item) => (
                    <div key={item._id} className="cart-item">
                      <div className="cart-item-image-container">
                        <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
                        <span className="cart-item-quantity">{item.quantity}</span>
                      </div>
                      <div className="cart-item-details">
                        <h3 className="cart-item-name">{item.name}</h3>
                        <p className="cart-item-price">
                          {item.quantity} x {item.price.toFixed(2)} ₺
                          <span className="cart-item-total">
                            {(item.price * item.quantity).toFixed(2)} ₺
                          </span>
                        </p>
                        {editingItemId === item._id ? (
                          <div className="cart-item-note-edit">
                            <input
                              type="text"
                              value={itemNote}
                              onChange={(e) => setItemNote(e.target.value)}
                              placeholder="Ürün notu ekleyin..."
                              autoFocus
                            />
                            <button onClick={saveItemNote}>
                              Kaydet
                            </button>
                          </div>
                        ) : (
                          <>
                            {item.notes ? (
                              <p className="cart-item-note" onClick={() => startEditingItemNote(item._id, item.notes)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                                {item.notes}
                              </p>
                            ) : (
                              <button 
                                className="cart-item-add-note"
                                onClick={() => startEditingItemNote(item._id, '')}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                                Not ekle
                              </button>
                            )}
                          </>
                        )}
                      </div>
                      <div className="cart-item-actions">
                        <div className="cart-quantity-control">
                          <button 
                            className="cart-quantity-btn"
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            aria-label="Azalt"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                          </button>
                          <button 
                            className="cart-quantity-btn"
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            aria-label="Artır"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="12" y1="5" x2="12" y2="19"></line>
                              <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                          </button>
                        </div>
                        <button 
                          className="cart-remove-btn"
                          onClick={() => removeFromCart(item._id)}
                          aria-label="Ürünü Kaldır"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="cart-notes">
                  {!showOrderNotes ? (
                    <button 
                      className="cart-add-note-btn"
                      onClick={() => setShowOrderNotes(true)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                      {orderNote ? 'Sipariş Notu: ' + orderNote : 'Sipariş Notu Ekle'}
                    </button>
                  ) : (
                    <div className="cart-note-input">
                      <textarea
                        value={orderNote}
                        onChange={(e) => setOrderNote(e.target.value)}
                        placeholder="Genel sipariş notu ekleyin..."
                        rows="2"
                      ></textarea>
                      <button onClick={() => setShowOrderNotes(false)}>
                        Kaydet
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="cart-summary">
                  <div className="cart-total">
                    <span className="cart-total-label">Toplam:</span>
                    <span className="cart-total-value">{total.toFixed(2)} ₺</span>
                  </div>
                  
                  <div className="cart-actions">
                    <button 
                      className="btn btn-outline btn-clear"
                      onClick={handleClearCart}
                    >
                      Temizle
                    </button>
                    <button 
                      className="btn btn-primary btn-complete"
                      onClick={handleCompleteOrderClick}
                    >
                      Siparişi Tamamla
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;