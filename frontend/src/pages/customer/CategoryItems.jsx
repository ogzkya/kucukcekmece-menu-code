// frontend/src/pages/customer/CategoryItems.jsx - Category items page
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMenuItemsByCategory, getCategoryById } from '../../api';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import MenuItemCard from '../../components/customer/MenuItemCard';
import Loader from '../../components/common/Loader';

const CategoryItems = () => {
  const { id } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuItemsResponse, categoryResponse] = await Promise.all([
          getMenuItemsByCategory(id),
          getCategoryById(id)
        ]);
        
        setMenuItems(menuItemsResponse.data);
        setCategory(categoryResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Veriler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);
// frontend/src/pages/customer/CategoryItems.jsx - Slug'a göre güncellenmiş sayfa
// useParams ile slug da alınacak, linkler slug içerecek şekilde güncellenecek

// Link yollarını güncelle


// MenuItemCard bileşenine restaurantSlug propu ekle

  if (loading) return <Loader />;

  return (
    <>
      <Header title={category ? category.name : 'Kategori'} />
      <main className="container">
        {error && <div className="alert alert-danger">{error}</div>}
        
        <div className="mb-4">
        <Link to={`/tesis/${slug}`} className="back-button">
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
  </svg>
  Ana Menüye Dön
</Link>
        </div>
        
        {category && (
          <h2 className="mb-4">{category.name}</h2>
        )}
        
        <div className="menu-item-cards">
          <div className="row">
            {menuItems.length > 0 ? (
              menuItems.map((menuItem) => (
                <div key={menuItem._id} className="col-12 col-md-6 col-lg-4">
                  <MenuItemCard menuItem={menuItem} restaurantSlug={slug} />
                </div>
              ))
            ) : (
              <div className="col-12">
                <p>Bu kategoride ürün bulunamadı.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CategoryItems;