// frontend/src/api/index.js
import axios from 'axios';

// API istemcisini oluştur
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Token eklemek için interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication API
export const login = (userData) => api.post('/auth/login', userData);
export const getUserProfile = () => api.get('/auth/profile');

// Categories API
export const getCategories = () => api.get('/categories');
export const getCategoryById = (id) => api.get(`/categories/${id}`);
export const getCategoriesByFacilityType = (facilityType) => 
  api.get(`/categories/facility/${facilityType}`);
export const createCategory = (formData) => {
  return api.post('/categories', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const updateCategory = (id, formData) => {
  return api.put(`/categories/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const deleteCategory = (id) => api.delete(`/categories/${id}`);
export const getAdminCategories = () => api.get('/categories/admin');

// Menu Items API
export const getMenuItems = () => api.get('/menu-items');
export const getMenuItemsByCategory = (categoryId) => api.get(`/menu-items/category/${categoryId}`);
export const getMenuItemById = (id) => api.get(`/menu-items/${id}`);
export const getMenuItemsByFacilityType = (facilityType) => 
  api.get(`/menu-items/facility/${facilityType}`);
export const getMenuItemsByCategoryAndFacilityType = (categoryId, facilityType) => 
  api.get(`/menu-items/category/${categoryId}/facility/${facilityType}`);
export const createMenuItem = (formData) => {
  return api.post('/menu-items', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const updateMenuItem = (id, formData) => {
  return api.put(`/menu-items/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const deleteMenuItem = (id) => api.delete(`/menu-items/${id}`);
export const getAdminMenuItems = () => api.get('/menu-items/admin');

// Restaurants API
export const getRestaurants = () => api.get('/restaurants');
export const getRestaurantById = (id) => api.get(`/restaurants/${id}`);
export const getRestaurantBySlug = (slug) => api.get(`/restaurants/slug/${slug}`);
export const getRestaurantsByFacilityType = (facilityType) => 
  api.get(`/restaurants/type/${facilityType}`);
export const createRestaurant = (formData) => {
  return api.post('/restaurants', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const updateRestaurant = (id, formData) => {
  return api.put(`/restaurants/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const deleteRestaurant = (id) => api.delete(`/restaurants/${id}`);
export const getAdminRestaurants = () => api.get('/restaurants/admin');

// User API
export const getAdminUsers = () => api.get('/users/admins');
export const createAdminUser = (userData) => api.post('/users/admin', userData);
export const getUserById = (id) => api.get(`/users/${id}`);
export const updateUser = (id, userData) => api.put(`/users/${id}`, userData);
export const deleteUser = (id) => api.delete(`/users/${id}`);