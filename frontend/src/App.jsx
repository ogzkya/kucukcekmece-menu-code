// frontend/src/App.jsx - Fixed imports and CartProvider handling
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
// The CartProvider is intentionally disabled as per comment

// CSS files import - order can be important for proper styling
import './styles/index.css';       // Base styling and color palette first
import './styles/additional.css';  // Additional component styles
import './styles/facility-cards.css'; // Facility/restaurant card styles
import './styles/animations.css';  // Animation styles

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

import Users from './pages/admin/Users';
import UserNew from './pages/admin/UserNew';
import UserEdit from './pages/admin/UserEdit';

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
      {/* Cart functionality is intentionally disabled */}
      <Routes>
        {/* Customer Routes */}
        <Route path="/" element={<RestaurantSelection />} />
        <Route path="/tesis/:slug" element={<Home />} />
        <Route path="/tesis/:slug/category/:id" element={<CategoryItems />} />
        <Route path="/tesis/:slug/item/:id" element={<ItemDetail />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin/users" 
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/users/new" 
          element={
            <ProtectedRoute>
              <UserNew />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/users/edit/:id" 
          element={
            <ProtectedRoute>
              <UserEdit />
            </ProtectedRoute>
          } 
        />
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
    </AuthProvider> 
  );
}

export default App;