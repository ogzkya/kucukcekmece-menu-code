// frontend/src/pages/customer/RestaurantSelection.jsx - Tesis seçim sayfası
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

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const { data } = await getRestaurants();
        setRestaurants(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        setError('Tesisler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      <Header title="Küçükçekmece Belediyesi Sosyal Tesisler" />
      <main className="container">
        {error && <div className="alert alert-danger">{error}</div>}
        
        <div className="restaurant-selection mt-4">
          <h2 className="text-center mb-4">Lütfen Tesis Seçiniz</h2>
          
          <div className="row">
            {restaurants.map((restaurant) => (
              <div key={restaurant._id} className="col-12 col-md-6 mb-4">
                <Link to={`/tesis/${restaurant.slug}`} className="restaurant-card">
                  <div className="card">
                    {restaurant.imageUrl && (
                      <img 
                        src={restaurant.imageUrl} 
                        alt={restaurant.name} 
                        className="card-img-top restaurant-image"
                      />
                    )}
                    <div className="card-body">
                      <h3 className="card-title">{restaurant.name}</h3>
                      <p className="card-text text-muted">{restaurant.address}</p>
                      {restaurant.description && (
                        <p className="card-text">{restaurant.description}</p>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default RestaurantSelection;