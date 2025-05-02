// frontend/src/App.jsx - Code splitting ile optimize edilmiş
import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// CSS dosyaları - sıralama önemli
import './styles/index.css';       // Temel stil ayarları önce
import './styles/additional.css';  // Ek stil ayarları
import './styles/facility-cards.css'; // Tesis kartları stilleri
import './styles/animations.css';  // Animasyonlar en son

// Loader - suspense için gerekli
import Loader from './components/common/Loader';

// Korumalı route bileşeni
import ProtectedRoute from './components/common/ProtectedRoute';

// Sık kullanılan müşteri sayfaları normal import (eager loading)
import RestaurantSelection from './pages/customer/RestaurantSelection';
import Home from './pages/customer/Home';

// Daha az kullanılan sayfaları lazy loading ile yükle
const CategoryItems = lazy(() => import('./pages/customer/CategoryItems'));
const ItemDetail = lazy(() => import('./pages/customer/ItemDetail'));

// Admin sayfaları lazy loading ile yükle
const AdminLogin = lazy(() => import('./pages/admin/Login'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminCategories = lazy(() => import('./pages/admin/Categories'));
const AdminMenuItems = lazy(() => import('./pages/admin/MenuItems'));
const AdminRestaurants = lazy(() => import('./pages/admin/Restaurants'));
const Users = lazy(() => import('./pages/admin/Users'));
const UserNew = lazy(() => import('./pages/admin/UserNew'));
const UserEdit = lazy(() => import('./pages/admin/UserEdit'));
const CategoryNew = lazy(() => import('./pages/admin/CategoryNew'));
const CategoryEdit = lazy(() => import('./pages/admin/CategoryEdit'));
const MenuItemNew = lazy(() => import('./pages/admin/MenuItemNew'));
const MenuItemEdit = lazy(() => import('./pages/admin/MenuItemEdit'));
const RestaurantNew = lazy(() => import('./pages/admin/RestaurantNew'));
const RestaurantEdit = lazy(() => import('./pages/admin/RestaurantEdit'));

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Müşteri Sayfaları */}
        <Route path="/" element={<RestaurantSelection />} />
        <Route path="/tesis/:slug" element={<Home />} />
        <Route path="/tesis/:slug/category/:id" element={
          <Suspense fallback={<Loader />}>
            <CategoryItems />
          </Suspense>
        } />
        <Route path="/tesis/:slug/item/:id" element={
          <Suspense fallback={<Loader />}>
            <ItemDetail />
          </Suspense>
        } />
        
        {/* Admin Sayfaları */}
        <Route path="/admin/login" element={
          <Suspense fallback={<Loader />}>
            <AdminLogin />
          </Suspense>
        } />
        
        {/* Admin Dashboard */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <Suspense fallback={<Loader />}>
              <AdminDashboard />
            </Suspense>
          </ProtectedRoute>
        } />
        
        {/* Admin Kullanıcı Yönetimi */}
        <Route path="/admin/users" element={
          <ProtectedRoute>
            <Suspense fallback={<Loader />}>
              <Users />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/admin/users/new" element={
          <ProtectedRoute>
            <Suspense fallback={<Loader />}>
              <UserNew />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/admin/users/edit/:id" element={
          <ProtectedRoute>
            <Suspense fallback={<Loader />}>
              <UserEdit />
            </Suspense>
          </ProtectedRoute>
        } />
        
        {/* Admin Kategori Yönetimi */}
        <Route path="/admin/categories" element={
          <ProtectedRoute>
            <Suspense fallback={<Loader />}>
              <AdminCategories />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/admin/categories/new" element={
          <ProtectedRoute>
            <Suspense fallback={<Loader />}>
              <CategoryNew />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/admin/categories/edit/:id" element={
          <ProtectedRoute>
            <Suspense fallback={<Loader />}>
              <CategoryEdit />
            </Suspense>
          </ProtectedRoute>
        } />
        
        {/* Admin Menü Öğeleri Yönetimi */}
        <Route path="/admin/menu-items" element={
          <ProtectedRoute>
            <Suspense fallback={<Loader />}>
              <AdminMenuItems />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/admin/menu-items/new" element={
          <ProtectedRoute>
            <Suspense fallback={<Loader />}>
              <MenuItemNew />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/admin/menu-items/edit/:id" element={
          <ProtectedRoute>
            <Suspense fallback={<Loader />}>
              <MenuItemEdit />
            </Suspense>
          </ProtectedRoute>
        } />
        
        {/* Admin Tesis Yönetimi */}
        <Route path="/admin/restaurants" element={
          <ProtectedRoute>
            <Suspense fallback={<Loader />}>
              <AdminRestaurants />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/admin/restaurants/new" element={
          <ProtectedRoute>
            <Suspense fallback={<Loader />}>
              <RestaurantNew />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/admin/restaurants/edit/:id" element={
          <ProtectedRoute>
            <Suspense fallback={<Loader />}>
              <RestaurantEdit />
            </Suspense>
          </ProtectedRoute>
        } />
        
        {/* Bilinmeyen rotalar için yönlendirme */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;