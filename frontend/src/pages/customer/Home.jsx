// frontend/src/pages/customer/Home.jsx - Sepet entegrasyonu eklenmiş anasayfa

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCategories, getRestaurantBySlug } from '../../api';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import CategoryCard from '../../components/customer/CategoryCard';
import SearchBox from '../../components/common/SearchBox';
import Loader from '../../components/common/Loader';
import CartButton from '../../components/customer/CartButton';
import Cart from '../../components/customer/Cart';

const Home = () => {
  const { slug } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sepet state'i
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesRes, restaurantRes] = await Promise.all([
          getCategories(),
          getRestaurantBySlug(slug)
        ]);
        
        setCategories(categoriesRes.data);
        setFilteredCategories(categoriesRes.data);
        setRestaurant(restaurantRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Veriler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);
  
  // Arama fonksiyonu
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCategories(categories);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = categories.filter(category => 
        category.name.toLowerCase().includes(query)
      );
      setFilteredCategories(filtered);
    }
  }, [searchQuery, categories]);
  
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Sepet işlevleri
  const handleOpenCart = () => {
    setShowCart(true);
    // Body scroll'u engelle
    document.body.style.overflow = 'hidden';
  };
  
  const handleCloseCart = () => {
    setShowCart(false);
    // Body scroll'u tekrar etkinleştir
    document.body.style.overflow = '';
  };

  if (loading) return <Loader />;

  return (
    <>
      <Header title={restaurant ? restaurant.name : 'Menü'} />
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
          
          {restaurant && (
            <div className="restaurant-info">
              <h2 className="restaurant-name">{restaurant.name}</h2>
              <div className="restaurant-meta">
                <p className="restaurant-address">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  {restaurant.address}
                </p>
                
                {restaurant.description && (
                  <p className="restaurant-description">
                    {restaurant.description}
                  </p>
                )}
              </div>
            </div>
          )}
          
          <div className="tab-buttons">
            <button className="tab-button active">Ana Menü</button>
            
          </div>
          
          <SearchBox 
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Kategorilerde ara..."
          />
          
          <div className="category-cards">
            <div className="row">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <div key={category._id} className="col-12 col-md-6 col-lg-4 mb-4">
                    <CategoryCard category={category} restaurantSlug={slug} />
                  </div>
                ))
              ) : (
                <div className="col-12">
                  <div className="empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                      <path d="M16 2v4"></path>
                      <path d="M8 2v4"></path>
                      <path d="M3 10h18"></path>
                    </svg>
                    <p>Henüz kategori bulunmamaktadır.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      
      {/* Sepet butonu ve sepet modülü */}
      <CartButton onClick={handleOpenCart} />
      {showCart && <Cart onClose={handleCloseCart} />}
    </>
  );
};

export default Home;