// frontend/src/App.jsx - CartProvider'ın eklenmiş hali
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext'; // Sepet context provider'ı eklendi

// CSS dosyalarını import et
import './styles/index.css';       // Temel stil ayarları ve renk paleti
import './styles/additional.css';  // Ek stiller ve bileşen özellikleri
import './styles/facility-cards.css'; // Tesis/restoran kartları stilleri
import './styles/animations.css';  // Animasyonlar
import './styles/cart.css';       // Yeni eklenen sepet stilleri

// Customer Pages
import Home from './pages/customer/Home';
import CategoryItems from './pages/customer/CategoryItems';
import ItemDetail from './pages/customer/ItemDetail';
import RestaurantSelection from './pages/customer/RestaurantSelection';

// Admin Pages
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminCategories from './pages/admin/Categories';
import AdminMenuItems from './pages/admin/MenuItems';
import AdminRestaurants from './pages/admin/Restaurants';

// Admin Form Pages
import CategoryNew from './pages/admin/CategoryNew';
import CategoryEdit from './pages/admin/CategoryEdit';
import MenuItemNew from './pages/admin/MenuItemNew';
import MenuItemEdit from './pages/admin/MenuItemEdit';
import RestaurantNew from './pages/admin/RestaurantNew';
import RestaurantEdit from './pages/admin/RestaurantEdit';

// Protected Route Component
import ProtectedRoute from './components/common/ProtectedRoute';

const App = () => {
  return (
    <AuthProvider>
      <CartProvider> {/* CartProvider eklendi */}
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<RestaurantSelection />} />
          <Route path="/tesis/:slug" element={<Home />} />
          <Route path="/tesis/:slug/category/:id" element={<CategoryItems />} />
          <Route path="/tesis/:slug/item/:id" element={<ItemDetail />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Admin Dashboard */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Categories */}
          <Route 
            path="/admin/categories" 
            element={
              <ProtectedRoute>
                <AdminCategories />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/categories/new" 
            element={
              <ProtectedRoute>
                <CategoryNew />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/categories/edit/:id" 
            element={
              <ProtectedRoute>
                <CategoryEdit />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Menu Items */}
          <Route 
            path="/admin/menu-items" 
            element={
              <ProtectedRoute>
                <AdminMenuItems />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/menu-items/new" 
            element={
              <ProtectedRoute>
                <MenuItemNew />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/menu-items/edit/:id" 
            element={
              <ProtectedRoute>
                <MenuItemEdit />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Restaurants */}
          <Route 
            path="/admin/restaurants" 
            element={
              <ProtectedRoute>
                <AdminRestaurants />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/restaurants/new" 
            element={
              <ProtectedRoute>
                <RestaurantNew />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/restaurants/edit/:id" 
            element={
              <ProtectedRoute>
                <RestaurantEdit />
              </ProtectedRoute>
            } 
          />
          
          {/* Redirect for unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CartProvider>
    </AuthProvider> 
  );
}
export default App;