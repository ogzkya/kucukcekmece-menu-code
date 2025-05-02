// frontend/src/pages/customer/RestaurantSelection.jsx - Restoran Seçim Sayfası Güncellemesi

import React, { useState, useEffect } from 'react';
import { getRestaurants } from '../../api';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import RestaurantCard from '../../components/customer/RestaurantCard';
import SearchBox from '../../components/common/SearchBox';
import Loader from '../../components/common/Loader';

const RestaurantSelection = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const { data } = await getRestaurants();
        setRestaurants(data);
        setFilteredRestaurants(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        setError('Tesisler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);
  
  // Arama fonksiyonu
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredRestaurants(restaurants);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = restaurants.filter(
        restaurant => 
          restaurant.name.toLowerCase().includes(query) || 
          restaurant.address.toLowerCase().includes(query) ||
          (restaurant.description && restaurant.description.toLowerCase().includes(query))
      );
      setFilteredRestaurants(filtered);
    }
  }, [searchQuery, restaurants]);
  
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  if (loading) return <Loader />;

  return (
    <>
      <Header title="Küçükçekmece Belediyesi Sosyal Tesisler" />
      
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
          
          <div className="restaurant-selection">
            <div className="restaurant-selection-header">
              <h2 className="restaurant-selection-title">Tesislerimiz</h2>
              <p className="restaurant-selection-subtitle">
                Lütfen menüsünü görmek istediğiniz tesisi seçiniz
              </p>
              
              <SearchBox 
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Tesis ara..."
              />
            </div>
            
            {filteredRestaurants.length > 0 ? (
              <div className="row facilities-row">
                {filteredRestaurants.map((restaurant) => (
                  <div key={restaurant._id} className="col-12 col-md-6 mb-4">
                    <RestaurantCard restaurant={restaurant} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                {searchQuery ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <p>"{searchQuery}" ile ilgili tesis bulunamadı.</p>
                    <button 
                      className="btn btn-outline mt-3"
                      onClick={() => setSearchQuery('')}
                    >
                      Aramayı Temizle
                    </button>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 8.5H12M17 12H9M17 15.5H6M6 3v18M4 3h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path>
                    </svg>
                    <p>Henüz tesis bulunmamaktadır.</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default RestaurantSelection;