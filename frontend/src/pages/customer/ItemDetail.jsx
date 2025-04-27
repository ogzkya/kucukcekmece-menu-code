// frontend/src/pages/customer/ItemDetail.jsx - Modern tasarıma güncellenmiş versiyon
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMenuItemById } from '../../api';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import MenuItemDetail from '../../components/customer/MenuItemDetail';
import Loader from '../../components/common/Loader';

const ItemDetail = () => {
  const { id, slug } = useParams();
  const [menuItem, setMenuItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        setLoading(true);
        const { data } = await getMenuItemById(id);
        setMenuItem(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching menu item:', error);
        setError('Ürün detayları yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        setLoading(false);
      }
    };

    fetchMenuItem();
  }, [id]);
  
  const getBackUrl = () => {
    if (menuItem && menuItem.category) {
      return `/tesis/${slug}/category/${menuItem.category}`;
    }
    return `/tesis/${slug}`;
  };

  if (loading) return <Loader />;

  return (
    <>
      <Header 
        title={menuItem ? menuItem.name : 'Ürün Detayı'} 
        showBackButton={true}
        backTo={getBackUrl()}
      />
      
      <main className="main-content">
        <div className="container">
          {error && (
            <div className="alert alert-danger mt-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {error}
            </div>
          )}
          
          <MenuItemDetail menuItem={menuItem} />
          
          {menuItem && (
            <div className="item-detail-actions">
              <button 
                onClick={() => window.history.back()} 
                className="btn btn-outline item-back-btn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Kategoriye Dön
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ItemDetail;