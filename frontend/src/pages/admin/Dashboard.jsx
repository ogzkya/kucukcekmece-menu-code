// frontend/src/pages/admin/Dashboard.jsx - Admin dashboard page
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminCategories, getAdminMenuItems, getAdminRestaurants } from '../../api';
import AdminLayout from '../../components/admin/AdminLayout';
import Loader from '../../components/common/Loader';

const Dashboard = () => {
  const [stats, setStats] = useState({
    categories: 0,
    menuItems: 0,
    restaurants: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [categoriesRes, menuItemsRes, restaurantsRes] = await Promise.all([
          getAdminCategories(),
          getAdminMenuItems(),
          getAdminRestaurants()
        ]);
        
        setStats({
          categories: categoriesRes.data.length,
          menuItems: menuItemsRes.data.length,
          restaurants: restaurantsRes.data.length,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setStats(prevState => ({
          ...prevState,
          loading: false,
          error: 'İstatistikler yüklenirken bir hata oluştu.'
        }));
      }
    };

    fetchStats();
  }, []);

  if (stats.loading) return <Loader />;

  return (
    <AdminLayout title="Panel Özeti">
      {stats.error && <div className="alert alert-danger">{stats.error}</div>}
      
      <div className="row">
        <div className="col-md-6 col-lg-4 mb-4">
          <div className="card p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h3 className="mb-0">{stats.categories}</h3>
                <p className="text-muted mb-0">Kategoriler</p>
              </div>
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M2 2h5v5H2V2z"/>
                  <path d="M9 2h5v5H9V2z"/>
                  <path d="M2 9h5v5H2V9z"/>
                  <path d="M9 9h5v5H9V9z"/>
                </svg>
              </div>
            </div>
            <Link to="/admin/categories" className="btn btn-outline mt-3">Yönet</Link>
          </div>
        </div>
        
        <div className="col-md-6 col-lg-4 mb-4">
          <div className="card p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h3 className="mb-0">{stats.menuItems}</h3>
                <p className="text-muted mb-0">Menü Öğeleri</p>
              </div>
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M2.5 3.5a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-11zm2-2a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1h-7zM0 13a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 16 13V6a1.5 1.5 0 0 0-1.5-1.5h-13A1.5 1.5 0 0 0 0 6v7zm1.5.5A.5.5 0 0 1 1 13V6a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-13z"/>
                </svg>
              </div>
            </div>
            <Link to="/admin/menu-items" className="btn btn-outline mt-3">Yönet</Link>
          </div>
        </div>
        
        <div className="col-md-6 col-lg-4 mb-4">
          <div className="card p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h3 className="mb-0">{stats.restaurants}</h3>
                <p className="text-muted mb-0">Tesisler</p>
              </div>
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M14.763.075A.5.5 0 0 1 15 .5v15a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V14h-1v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V10a.5.5 0 0 1 .342-.474L6 7.64V4.5a.5.5 0 0 1 .276-.447l8-4a.5.5 0 0 1 .487.022zM6 8.694 1 10.36V15h5V8.694zM7 15h2v-1.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5V15h2V1.309l-7 3.5V15z"/>
                  <path d="M2 11h1v1H2v-1zm2 0h1v1H4v-1zm-2 2h1v1H2v-1zm2 0h1v1H4v-1zm4-4h1v1H8V9zm2 0h1v1h-1V9zm-2 2h1v1H8v-1zm2 0h1v1h-1v-1zm2-2h1v1h-1V9zm0 2h1v1h-1v-1zM8 7h1v1H8V7zm2 0h1v1h-1V7zm2 0h1v1h-1V7zM8 5h1v1H8V5zm2 0h1v1h-1V5zm2 0h1v1h-1V5zm0-2h1v1h-1V3z"/>
                </svg>
              </div>
            </div>
            <Link to="/admin/restaurants" className="btn btn-outline mt-3">Yönet</Link>
          </div>
        </div>
      </div>
      
      <div className="card p-3 mb-4">
        <h3>Hızlı Erişim</h3>
        <div className="row mt-3">
          <div className="col-md-6 mb-3">
            <Link to="/admin/categories/new" className="btn btn-primary w-100">
              Yeni Kategori Ekle
            </Link>
          </div>
          <div className="col-md-6 mb-3">
            <Link to="/admin/menu-items/new" className="btn btn-primary w-100">
              Yeni Menü Öğesi Ekle
            </Link>
          </div>
        </div>
      </div>
      
      <div className="card p-3">
        <h3>QR Kodu Oluştur</h3>
        <p className="mb-3">
          Ana menüye erişim sağlayacak QR kodunu aşağıdaki butona tıklayarak oluşturabilirsiniz.
        </p>
        <p className="mb-3">
          QR kodu oluşturmak için kullanabileceğiniz servis: 
          <a href="https://www.qrcode-monkey.com/" target="_blank" rel="noopener noreferrer" className="ms-2">
            QR Code Monkey
          </a>
        </p>
        <p>QR kod içeriği olarak aşağıdaki URL'i kullanın:</p>
        <div className="alert alert-info">
          <code>{window.location.origin}</code>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;