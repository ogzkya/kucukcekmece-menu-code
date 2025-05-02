// frontend/src/pages/customer/CategoryItems.jsx - Optimize edilmiş kod
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { getMenuItemsByCategoryAndFacilityType, getCategoryById, getRestaurantBySlug } from '../../api';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import MenuItemCard from '../../components/customer/MenuItemCard';
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

const CategoryItems = () => {
  const { id, slug } = useParams();
  const [data, setData] = useState({
    menuItems: [],
    filteredItems: [],
    category: null,
    restaurant: null,
    loading: true,
    error: null
  });
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const fetchData = useCallback(async () => {
    // Önbellekte veri var mı kontrol et
    const cacheKey = `category_items_${slug}_${id}`;
    const cachedData = sessionStorage.getItem(cacheKey);
    
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      setData(parsedData);
      return;
    }
    
    try {
      setData(prev => ({ ...prev, loading: true }));
      
      // Önce tesisi ve kategoriyi paralel olarak getir
      const [restaurantRes, categoryRes] = await Promise.all([
        getRestaurantBySlug(slug),
        getCategoryById(id)
      ]);
      
      const restaurantData = restaurantRes.data;
      const categoryData = categoryRes.data;
      
      // Sonra tesis türüne ve kategoriye göre menü öğelerini getir
      const menuItemsRes = await getMenuItemsByCategoryAndFacilityType(
        id, 
        restaurantData.facilityType
      );
      
      const newData = {
        menuItems: menuItemsRes.data,
        filteredItems: menuItemsRes.data,
        category: categoryData,
        restaurant: restaurantData,
        loading: false,
        error: null
      };
      
      // Veriyi önbelleğe kaydet - 5 dakika için geçerli olsun
      sessionStorage.setItem(cacheKey, JSON.stringify(newData));
      setData(newData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setData({
        menuItems: [],
        filteredItems: [],
        category: null,
        restaurant: null,
        loading: false,
        error: 'Veriler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
      });
    }
  }, [id, slug]);

  useEffect(() => {
    fetchData();
    
    // Önbellek temizliği için
    return () => {
      // Component unmount olduğunda işlemler
    };
  }, [fetchData]);
  
  // Arama fonksiyonu
  useEffect(() => {
    if (data.menuItems.length === 0) return;
    
    if (debouncedSearchQuery.trim() === '') {
      setData(prev => ({ ...prev, filteredItems: prev.menuItems }));
    } else {
      const query = debouncedSearchQuery.toLowerCase();
      const filtered = data.menuItems.filter(item => 
        item.name.toLowerCase().includes(query) || 
        (item.description && item.description.toLowerCase().includes(query))
      );
      setData(prev => ({ ...prev, filteredItems: filtered }));
    }
  }, [debouncedSearchQuery, data.menuItems]);
  
  const handleSearch = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  // Menü öğesi listesini memoize et
  const menuItemList = useMemo(() => {
    return data.filteredItems.map((menuItem) => (
      <div key={menuItem._id} className="col-12 col-md-6 col-lg-4 mb-4">
        <MenuItemCard menuItem={menuItem} restaurantSlug={slug} />
      </div>
    ));
  }, [data.filteredItems, slug]);

  // Boş durum bileşeni
  const EmptyState = useCallback(() => (
    <div className="empty-state">
      {searchQuery ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <p>"{searchQuery}" ile ilgili ürün bulunamadı.</p>
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
          <p>Bu kategoride henüz ürün bulunmamaktadır.</p>
        </>
      )}
    </div>
  ), [searchQuery]);

  if (data.loading) return <Loader />;

  return (
    <>
      <Header 
        title={data.category ? data.category.name : 'Kategori'} 
        showBackButton={true}
        backTo={`/tesis/${slug}`}
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
          
          <div className="category-header">
            {data.category && (
              <div>
                <div className="tab-buttons">
                  <button className="tab-button active">Ana Menü</button>
                </div>
                
                <SearchBox 
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="Menüde ara..."
                />
              </div>
            )}
          </div>
          
          <div className="menu-item-cards">
            {data.filteredItems.length > 0 ? (
              <div className="row">
                {menuItemList}
              </div>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CategoryItems;