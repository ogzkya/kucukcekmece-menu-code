// frontend/src/pages/customer/CategoryItems.jsx - Tesis türüne göre menü öğelerini getirme
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMenuItemsByCategoryAndFacilityType, getCategoryById, getRestaurantBySlug } from '../../api';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import MenuItemCard from '../../components/customer/MenuItemCard';
import SearchBox from '../../components/common/SearchBox';
import Loader from '../../components/common/Loader';

const CategoryItems = () => {
  const { id, slug } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [category, setCategory] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Önce tesisi ve kategoriyi paralel olarak getir
        const [restaurantRes, categoryRes] = await Promise.all([
          getRestaurantBySlug(slug),
          getCategoryById(id)
        ]);
        
        const restaurantData = restaurantRes.data;
        setRestaurant(restaurantData);
        setCategory(categoryRes.data);
        
        // Sonra tesis türüne ve kategoriye göre menü öğelerini getir
        const menuItemsRes = await getMenuItemsByCategoryAndFacilityType(
          id, 
          restaurantData.facilityType
        );
        
        setMenuItems(menuItemsRes.data);
        setFilteredItems(menuItemsRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Veriler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        setLoading(false);
      }
    };

    fetchData();
  }, [id, slug]);
  
  // Arama fonksiyonu
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredItems(menuItems);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = menuItems.filter(item => 
        item.name.toLowerCase().includes(query) || 
        (item.description && item.description.toLowerCase().includes(query))
      );
      setFilteredItems(filtered);
    }
  }, [searchQuery, menuItems]);
  
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  if (loading) return <Loader />;

  return (
    <>
      <Header 
        title={category ? category.name : 'Kategori'} 
        showBackButton={true}
        backTo={`/tesis/${slug}`}
      />
      
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
          
          <div className="category-header">
            {category && (
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
            {filteredItems.length > 0 ? (
              <div className="row">
                {filteredItems.map((menuItem) => (
                  <div key={menuItem._id} className="col-12 col-md-6 col-lg-4 mb-4">
                    <MenuItemCard menuItem={menuItem} restaurantSlug={slug} />
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
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CategoryItems;