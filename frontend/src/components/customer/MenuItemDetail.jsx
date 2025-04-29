// frontend/src/components/customer/MenuItemDetail.jsx - Sepet işlevselliği devre dışı bırakılmış menü öğesi detay sayfası
import React from 'react';
// import AddToCartButton from './AddToCartButton';

const MenuItemDetail = ({ menuItem }) => {
  if (!menuItem) return null;

  return (
    <div className="menu-item-detail fade-in">
      <div className="menu-item-detail-header">
        <img 
          src={menuItem.imageUrl} 
          alt={menuItem.name} 
          className="menu-item-detail-image" 
        />
      </div>
      
      <div className="menu-item-detail-content">
        <div className="menu-item-detail-info">
          <h2 className="menu-item-detail-title">{menuItem.name}</h2>
          
          {menuItem.description && (
            <p className="menu-item-detail-description">{menuItem.description}</p>
          )}
          
          <div className="menu-item-detail-meta">
            {menuItem.price > 0 && (
              <div className="menu-item-detail-price">
                {menuItem.price.toFixed(2)} ₺
                {menuItem.weight && (
                  <span className="menu-item-detail-weight ms-2">
                    {menuItem.weight}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Sipariş ekleme bölümü - devre dışı bırakıldı */}
        {/* <AddToCartButton menuItem={menuItem} isDetail={true} /> */}
        
        {menuItem.allergens && menuItem.allergens.length > 0 && (
          <div className="menu-item-detail-allergens">
            <h4 className="menu-item-detail-section-title">Alerjenler</h4>
            <div className="menu-item-detail-allergens-list">
              {menuItem.allergens.map((allergen, index) => (
                <span key={index} className="menu-item-detail-allergen">
                  {allergen}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="menu-item-detail-footer">
          <div className="menu-item-detail-disclaimer">
            <p className="text-muted mb-0">
              <small>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-1">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                Fiyatlar güncel olup, değişiklik gösterebilir. Lütfen sipariş vermeden önce teyit ediniz.
              </small>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemDetail;