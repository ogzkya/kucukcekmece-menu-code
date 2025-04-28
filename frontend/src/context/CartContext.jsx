// frontend/src/context/CartContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

// Sepet context'i oluşturuldu
const CartContext = createContext();

// Hook kullanımı için helper fonksiyon
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // LocalStorage'dan sepet verilerini al veya boş bir dizi başlat
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('oddmenu_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  // Sipariş notu
  const [orderNote, setOrderNote] = useState('');
  
  // Masa numarası
  const [tableNumber, setTableNumber] = useState(() => {
    return localStorage.getItem('oddmenu_table') || '';
  });

  // Sepet değiştiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('oddmenu_cart', JSON.stringify(cartItems));
  }, [cartItems]);
  
  // Masa numarası değiştiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('oddmenu_table', tableNumber);
  }, [tableNumber]);

  // Sepete ürün ekle - useCallback ile optimize edildi
  const addToCart = useCallback((menuItem, quantity = 1, notes = '') => {
    setCartItems(prevItems => {
      // Aynı ürün daha önce eklenmiş mi kontrol et
      const existingItemIndex = prevItems.findIndex(item => item._id === menuItem._id);
      
      if (existingItemIndex >= 0) {
        // Ürün zaten sepette, miktarını artır
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
          // Not yoksa önceki notu koru, varsa güncelle
          notes: notes || updatedItems[existingItemIndex].notes
        };
        return updatedItems;
      } else {
        // Yeni ürün ekle
        return [...prevItems, { 
          ...menuItem, 
          quantity, 
          notes,
          addedAt: new Date().toISOString() 
        }];
      }
    });
  }, []);

  // Sepetten ürün çıkar
  const removeFromCart = useCallback((itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== itemId));
  }, []);

  // Ürün miktarını güncelle
  const updateQuantity = useCallback((itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  }, [removeFromCart]);
  
  // Ürün notunu güncelle
  const updateItemNote = useCallback((itemId, note) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item._id === itemId ? { ...item, notes: note } : item
      )
    );
  }, []);

  // Sepeti temizle
  const clearCart = useCallback(() => {
    setCartItems([]);
    setOrderNote('');
  }, []);

  // Sepetteki toplam ürün sayısını hesapla
  const getCartCount = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  // Sepetteki toplam tutarı hesapla
  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cartItems]);

  // Sepetteki ürün sayısını kontrol et
  const isInCart = useCallback((menuItemId) => {
    return cartItems.some(item => item._id === menuItemId);
  }, [cartItems]);
  
  // Sepetteki bir ürünün miktarını bul
  const getItemQuantity = useCallback((menuItemId) => {
    const item = cartItems.find(item => item._id === menuItemId);
    return item ? item.quantity : 0;
  }, [cartItems]);

  return (
    <CartContext.Provider value={{
      cartItems,
      orderNote,
      setOrderNote,
      tableNumber,
      setTableNumber,
      addToCart,
      removeFromCart,
      updateQuantity,
      updateItemNote,
      clearCart,
      getCartCount,
      getCartTotal,
      isInCart,
      getItemQuantity
    }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;