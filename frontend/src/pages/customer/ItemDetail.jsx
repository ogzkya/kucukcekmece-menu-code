// frontend/src/pages/customer/ItemDetail.jsx - Item detail page
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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

  if (loading) return <Loader />;

  return (
    <>
      <Header title={menuItem ? menuItem.name : 'Ürün Detayı'} />
      <main className="container">
        {error && <div className="alert alert-danger">{error}</div>}
        
        <div className="mb-4">
          <Link to={menuItem && menuItem.category ? `/tesis/${slug}/category/${menuItem.category}` : `/tesis/${slug}`} className="back-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
            </svg>
            Kategoriye Dön
          </Link>
        </div>
        
        <MenuItemDetail menuItem={menuItem} />
      </main>
      <Footer />
    </>
  );
};

export default ItemDetail;