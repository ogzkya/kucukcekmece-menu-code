// frontend/src/components/admin/AdminLayout.jsx
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = ({ children, title }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Yönetim Paneli</h2>
          <p className="mb-0">Hoş geldiniz, {user?.name}</p>
        </div>
        <ul className="admin-sidebar-menu">
          <li className="admin-sidebar-menu-item">
            <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>
              Ana Sayfa
            </Link>
          </li>
          <li className="admin-sidebar-menu-item">
            <Link 
              to="/admin/categories" 
              className={location.pathname === '/admin/categories' ? 'active' : ''}
            >
              Kategoriler
            </Link>
          </li>
          <li className="admin-sidebar-menu-item">
            <Link 
              to="/admin/menu-items" 
              className={location.pathname === '/admin/menu-items' ? 'active' : ''}
            >
              Menü Öğeleri
            </Link>
          </li>
          <li className="admin-sidebar-menu-item">
            <Link 
              to="/admin/restaurants" 
              className={location.pathname === '/admin/restaurants' ? 'active' : ''}
            >
              Tesisler
            </Link>
          </li>
          <li className="admin-sidebar-menu-item">
            <button onClick={handleLogout} className="btn btn-outline w-100 mt-4">
              Çıkış Yap
            </button>
          </li>
        </ul>
      </aside>
      <main className="admin-content">
        <div className="admin-header">
          <h1 className="admin-title">{title}</h1>
        </div>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;