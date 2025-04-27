// frontend/src/pages/customer/RestaurantSelection.jsx - Modern tasarıma güncellenmiş versiyon
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRestaurants } from '../../api';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import Loader from '../../components/common/Loader';

const RestaurantSelection = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);

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
            <div className="restaurant-selection-header text-center">
              <h2 className="restaurant-selection-title">Tesislerimiz</h2>
              <p className="restaurant-selection-subtitle mb-4">
                Lütfen menüsünü görmek istediğiniz tesisi seçiniz
              </p>
              
              <div className="search-bar mx-auto mb-5">
                <div className="search-input-wrapper">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Tesis ara..."
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                  {searchQuery && (
                    <button 
                      className="search-clear-btn"
                      onClick={() => setSearchQuery('')}
                      aria-label="Aramayı temizle"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {filteredRestaurants.length > 0 ? (
              <div className="row facilities-row">
                {filteredRestaurants.map((restaurant) => (
                  <div key={restaurant._id} className="col-12 col-md-6 mb-4">
                    <Link to={`/tesis/${restaurant.slug}`} className="facility-card">
                      <div className="facility-image-container">
                        {restaurant.imageUrl ? (
                          <img 
                            src={restaurant.imageUrl} 
                            alt={restaurant.name} 
                            className="facility-image" 
                          />
                        ) : (
                          <div className="facility-image-placeholder">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                              <circle cx="8.5" cy="8.5" r="1.5"></circle>
                              <polyline points="21 15 16 10 5 21"></polyline>
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="facility-content">
                        <h3 className="facility-title">{restaurant.name}</h3>
                        <div className="facility-address">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                          {restaurant.address}
                        </div>
                        {restaurant.description && (
                          <p className="facility-description">
                            {restaurant.description}
                          </p>
                        )}
                        <div className="facility-action">
                          <span className="facility-button">
                            Menüyü Görüntüle
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ms-2">
                              <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                          </span>
                        </div>
                      </div>
                    </Link>
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