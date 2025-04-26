// frontend/src/pages/customer/Home.jsx - Slug'a göre güncellenmiş sayfa
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCategories, getRestaurantBySlug } from '../../api';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import CategoryCard from '../../components/customer/CategoryCard';
import Loader from '../../components/common/Loader';

const Home = () => {
  const { slug } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, restaurantRes] = await Promise.all([
          getCategories(),
          getRestaurantBySlug(slug)
        ]);
        
        setCategories(categoriesRes.data);
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

  if (loading) return <Loader />;

  return (
    <>
      <Header title={restaurant ? restaurant.name : 'Menü'} />
      <main className="container">
        {error && <div className="alert alert-danger">{error}</div>}
        
        {restaurant && (
          <div className="restaurant-info mb-4">
            <h2>{restaurant.name}</h2>
            <p className="text-muted">{restaurant.address}</p>
            {restaurant.description && <p>{restaurant.description}</p>}
          </div>
        )}
        
        <div className="category-cards">
          <div className="row">
            {categories.map((category) => (
              <div key={category._id} className="col-12 col-md-6 col-lg-4">
                <CategoryCard category={category} restaurantSlug={slug} />
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Home;
