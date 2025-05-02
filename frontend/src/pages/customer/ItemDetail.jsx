// frontend/src/pages/customer/ItemDetail.jsx - Optimize edilmiş kod
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getMenuItemById } from '../../api';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import MenuItemDetail from '../../components/customer/MenuItemDetail';
import Loader from '../../components/common/Loader';

const ItemDetail = () => {
  const { id, slug } = useParams();
  const [data, setData] = useState({
    menuItem: null,
    loading: true,
    error: null
  });
  
  const fetchMenuItem = useCallback(async () => {
    // Önbellekte veri var mı kontrol et
    const cacheKey = `menu_item_${id}`;
    const cachedData = sessionStorage.getItem(cacheKey);
    
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      setData(parsedData);
      return;
    }
    
    try {
      setData(prev => ({ ...prev, loading: true }));
      const { data: responseData } = await getMenuItemById(id);
      
      const newData = {
        menuItem: responseData,
        loading: false,
        error: null
      };
      
      // Veriyi önbelleğe kaydet
      sessionStorage.setItem(cacheKey, JSON.stringify(newData));
      setData(newData);
    } catch (error) {
      console.error('Error fetching menu item:', error);
      setData({
        menuItem: null,
        loading: false,
        error: 'Ürün detayları yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
      });
    }
  }, [id]);

  useEffect(() => {
    fetchMenuItem();
    
    // Önbellek temizliği için
    return () => {
      // Component unmount olduğunda işlemler
    };
  }, [fetchMenuItem]);
  
  const getBackUrl = useCallback(() => {
    if (data.menuItem && data.menuItem.category) {
      return `/tesis/${slug}/category/${data.menuItem.category}`;
    }
    return `/tesis/${slug}`;
  }, [data.menuItem, slug]);

  if (data.loading) return <Loader />;

  return (
    <>
      <Header 
        title={data.menuItem ? data.menuItem.name : 'Ürün Detayı'} 
        showBackButton={true}
        backTo={getBackUrl()}
      />
      
      <main className="main-content">
        <div className="container">
          {data.error && (
            <div className="alert alert-danger mt-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {data.error}
            </div>
          )}
          
          <MenuItemDetail menuItem={data.menuItem} />
          
          {data.menuItem && (
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