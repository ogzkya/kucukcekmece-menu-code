// frontend/src/pages/customer/Home.jsx - Optimize edilmiş kod
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { getCategoriesByFacilityType, getRestaurantBySlug } from '../../api';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import CategoryCard from '../../components/customer/CategoryCard';
import SearchBox from '../../components/common/SearchBox';
import Loader from '../../components/common/Loader';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

const Home = () => {
  const { slug } = useParams();
  const [data, setData] = useState({
    restaurant: null,
    categories: [],
    filteredCategories: [],
    loading: true,
    error: null
  });
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const fetchData = useCallback(async () => {
    // Önbellekte veri var mı kontrol et
    const cacheKey = `restaurant_${slug}`;
    const cachedData = sessionStorage.getItem(cacheKey);
    
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      setData(parsedData);
      return;
    }
    
    try {
      setData(prev => ({ ...prev, loading: true }));
      
      // Önce tesisi getir
      const restaurantRes = await getRestaurantBySlug(slug);
      const restaurantData = restaurantRes.data;
      
      // facilityType null veya undefined ise varsayılan değer kullan
      const facilityType = restaurantData?.facilityType || 'social';
      
      // Tesis tipine göre kategorileri getir
      try {
        const categoriesRes = await getCategoriesByFacilityType(facilityType);
        const newData = {
          restaurant: restaurantData,
          categories: categoriesRes.data,
          filteredCategories: categoriesRes.data,
          loading: false,
          error: null
        };

        // Veriyi önbelleğe kaydet - 5 dakika için geçerli olsun
        sessionStorage.setItem(cacheKey, JSON.stringify(newData));
        setData(newData);
      } catch (categoryError) {
        console.error('Error fetching categories:', categoryError);
        setData({
          restaurant: restaurantData,
          categories: [],
          filteredCategories: [],
          loading: false,
          error: 'Kategoriler yüklenirken bir hata oluştu.'
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setData({
        restaurant: null,
        categories: [],
        filteredCategories: [],
        loading: false,
        error: 'Veriler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
      });
    }
  }, [slug]);

  useEffect(() => {
    fetchData();
    
    // Önbellek temizliği için
    return () => {
      // Component unmount olduğunda işlemler
    };
  }, [fetchData]);
  
  useEffect(() => {
    if (data.categories.length === 0) return;
    
    if (debouncedSearchQuery.trim() === '') {
      setData(prev => ({ ...prev, filteredCategories: prev.categories }));
    } else {
      const query = debouncedSearchQuery.toLowerCase();
      const filtered = data.categories.filter(category => 
        category.name.toLowerCase().includes(query)
      );
      setData(prev => ({ ...prev, filteredCategories: filtered }));
    }
  }, [debouncedSearchQuery, data.categories]);
  
  const handleSearch = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  // Kategori listesini memoize et
  const categoryList = useMemo(() => {
    return data.filteredCategories.map((category) => (
      <div key={category._id} className="col-12 col-md-6 col-lg-4 mb-4">
        <CategoryCard category={category} restaurantSlug={slug} />
      </div>
    ));
  }, [data.filteredCategories, slug]);

  // Tesis bilgi paneli
  const RestaurantInfo = useCallback(() => {
    if (!data.restaurant) return null;
    
    return (
      <div className="restaurant-info">
        <h2 className="restaurant-name">{data.restaurant.name}</h2>
        <div className="restaurant-meta">
          <p className="restaurant-address">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            {data.restaurant.address}
          </p>
          
          {data.restaurant.description && (
            <p className="restaurant-description">
              {data.restaurant.description}
            </p>
          )}
          
          <p className="facility-type-badge">
            <span className={`badge ${data.restaurant.facilityType === 'retirement' ? 'bg-info' : 'bg-primary'}`}>
              {data.restaurant.facilityType === 'retirement' ? 'Emekliler Cafesi' : 'Sosyal Tesis'}
            </span>
          </p>
        </div>
      </div>
    );
  }, [data.restaurant]);

  // Boş durum bileşeni
  const EmptyState = useCallback(() => (
    <div className="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 2v4"></path>
        <path d="M8 2v4"></path>
        <path d="M3 10h18"></path>
      </svg>
      <p>Henüz kategori bulunmamaktadır.</p>
    </div>
  ), []);

  if (data.loading) return <Loader />;

  return (
    <>
      <Header title={data.restaurant ? data.restaurant.name : 'Menü'} />
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
          
          <RestaurantInfo />
          
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
              {data.filteredCategories.length > 0 ? (
                categoryList
              ) : (
                <div className="col-12">
                  <EmptyState />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Home;