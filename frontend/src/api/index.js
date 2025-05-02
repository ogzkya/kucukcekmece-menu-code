// frontend/src/api/index.js - İstek iptali ve önbellek ile geliştirilmiş
import axios from 'axios';

// API istemcisini oluştur
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

// İstek iptal tokenlarını saklamak için obje
const cancelTokens = {};

// Token eklemek için interceptor
api.interceptors.request.use(
  (config) => {
    // Önceki isteği iptal et (varsa)
    const endpoint = config.url;
    if (cancelTokens[endpoint]) {
      cancelTokens[endpoint]('İstek tekrarlandı');
    }
    
    // Yeni bir iptal tokeni oluştur
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    config.cancelToken = source.token;
    cancelTokens[endpoint] = source.cancel;
    
    // Yetkilendirme token'ı ekle
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Önbellek sistemi
const cache = {
  data: {},
  timeout: {}, // Timeout ID'leri

  // Önbelleğe veri ekle
  set: (key, data, ttl = 300000) => { // Default 5 dakika
    // Önceki timeout varsa temizle
    if (cache.timeout[key]) {
      clearTimeout(cache.timeout[key]);
    }
    
    // Veriyi önbelleğe ekle
    cache.data[key] = data;
    
    // Timeout ayarla
    cache.timeout[key] = setTimeout(() => {
      delete cache.data[key];
      delete cache.timeout[key];
    }, ttl);
  },
  
  // Önbellekten veri al
  get: (key) => {
    return cache.data[key];
  },
  
  // Önbellekte veri var mı kontrol et
  has: (key) => {
    return !!cache.data[key];
  },
  
  // Belirli bir anahtarı önbellekten temizle
  clear: (key) => {
    if (cache.timeout[key]) {
      clearTimeout(cache.timeout[key]);
    }
    delete cache.data[key];
    delete cache.timeout[key];
  },
  
  // Tüm önbelleği temizle
  clearAll: () => {
    Object.keys(cache.timeout).forEach(key => {
      clearTimeout(cache.timeout[key]);
    });
    cache.data = {};
    cache.timeout = {};
  }
};

// Önbellek kullanarak API istekleri
const getWithCache = async (url, ttl = 300000) => {
  if (cache.has(url)) {
    return { data: cache.get(url) };
  }
  
  const response = await api.get(url);
  cache.set(url, response.data, ttl);
  return response;
};

// Authentication API
export const login = (userData) => api.post('/auth/login', userData);
export const getUserProfile = () => api.get('/auth/profile');

// Categories API - önbellekli
export const getCategories = () => getWithCache('/categories');
export const getCategoryById = (id) => getWithCache(`/categories/${id}`);
export const getCategoriesByFacilityType = (facilityType) => 
  getWithCache(`/categories/facility/${facilityType}`);
export const createCategory = (formData) => {
  cache.clear('/categories');
  cache.clear('/categories/admin');
  return api.post('/categories', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const updateCategory = (id, formData) => {
  cache.clear('/categories');
  cache.clear('/categories/admin');
  cache.clear(`/categories/${id}`);
  return api.put(`/categories/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const deleteCategory = (id) => {
  cache.clear('/categories');
  cache.clear('/categories/admin');
  cache.clear(`/categories/${id}`);
  return api.delete(`/categories/${id}`);
};
export const getAdminCategories = () => getWithCache('/categories/admin');

// Menu Items API - önbellekli
export const getMenuItems = () => getWithCache('/menu-items');
export const getMenuItemsByCategory = (categoryId) => 
  getWithCache(`/menu-items/category/${categoryId}`);
export const getMenuItemById = (id) => 
  getWithCache(`/menu-items/${id}`);
export const getMenuItemsByFacilityType = (facilityType) => 
  getWithCache(`/menu-items/facility/${facilityType}`);
export const getMenuItemsByCategoryAndFacilityType = (categoryId, facilityType) => 
  getWithCache(`/menu-items/category/${categoryId}/facility/${facilityType}`);
export const createMenuItem = (formData) => {
  // İlgili önbellekleri temizle
  cache.clear('/menu-items');
  cache.clear('/menu-items/admin');
  return api.post('/menu-items', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const updateMenuItem = (id, formData) => {
  // İlgili önbellekleri temizle
  cache.clear('/menu-items');
  cache.clear('/menu-items/admin');
  cache.clear(`/menu-items/${id}`);
  return api.put(`/menu-items/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const deleteMenuItem = (id) => {
  // İlgili önbellekleri temizle
  cache.clear('/menu-items');
  cache.clear('/menu-items/admin');
  cache.clear(`/menu-items/${id}`);
  return api.delete(`/menu-items/${id}`);
};
export const getAdminMenuItems = () => getWithCache('/menu-items/admin');

// Restaurants API - önbellekli
export const getRestaurants = () => getWithCache('/restaurants');
export const getRestaurantById = (id) => getWithCache(`/restaurants/${id}`);
export const getRestaurantBySlug = (slug) => getWithCache(`/restaurants/slug/${slug}`);
export const getRestaurantsByFacilityType = (facilityType) => 
  getWithCache(`/restaurants/type/${facilityType}`);
export const createRestaurant = (formData) => {
  // İlgili önbellekleri temizle
  cache.clear('/restaurants');
  cache.clear('/restaurants/admin');
  return api.post('/restaurants', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const updateRestaurant = (id, formData) => {
  // İlgili önbellekleri temizle
  cache.clear('/restaurants');
  cache.clear('/restaurants/admin');
  cache.clear(`/restaurants/${id}`);
  return api.put(`/restaurants/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const deleteRestaurant = (id) => {
  // İlgili önbellekleri temizle
  cache.clear('/restaurants');
  cache.clear('/restaurants/admin');
  cache.clear(`/restaurants/${id}`);
  return api.delete(`/restaurants/${id}`);
};
export const getAdminRestaurants = () => getWithCache('/restaurants/admin');

// User API - önbellek yok, her zaman güncel veri gerekli
export const getAdminUsers = () => api.get('/users/admins');
export const createAdminUser = (userData) => api.post('/users/admin', userData);
export const getUserById = (id) => api.get(`/users/${id}`);
export const updateUser = (id, userData) => api.put(`/users/${id}`, userData);
export const deleteUser = (id) => api.delete(`/users/${id}`);

// Önbelleği temizleme fonksiyonları - logout veya admin değişikliklerinde kullanılabilir
export const clearCache = () => {
  cache.clearAll();
};

export default api;