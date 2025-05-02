// backend/controllers/restaurantController.js - Hata yönetimi ve form veri işleme düzeltildi
import Restaurant from '../models/Restaurant.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module için __dirname oluştur
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Debug logger
const debugLog = (message, data = null) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[RestaurantController] ${message}`);
    if (data) console.log(JSON.stringify(data, null, 2));
  }
};

// @desc    Get all restaurants
// @route   GET /api/restaurants
// @access  Public
export const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ isActive: true });
    res.json(restaurants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get restaurants by facility type
// @route   GET /api/restaurants/type/:facilityType
// @access  Public
export const getRestaurantsByFacilityType = async (req, res) => {
  try {
    const { facilityType } = req.params;
    
    const restaurants = await Restaurant.find({ 
      isActive: true,
      facilityType
    });
    
    res.json(restaurants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all restaurants for admin
// @route   GET /api/restaurants/admin
// @access  Private/Admin
export const getAdminRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({});
    res.json(restaurants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get restaurant by ID
// @route   GET /api/restaurants/:id
// @access  Public
export const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (restaurant) {
      res.json(restaurant);
    } else {
      res.status(404).json({ message: 'Restaurant not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create new restaurant
// @route   POST /api/restaurants
// @access  Private/Admin
export const createRestaurant = async (req, res) => {
  try {
    debugLog('Creating restaurant with body:', req.body);
    const { name, address, description, isActive, slug, phone, facilityType } = req.body;
    
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Restaurant name is required' });
    }
    
    if (!address || address.trim() === '') {
      return res.status(400).json({ message: 'Address is required' });
    }
    
    let imageUrl = '';

    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
      debugLog('Image uploaded', { filename: req.file.filename, path: imageUrl });
    }

    // Slug oluşturma yardımcı fonksiyonu
    const createSlugFromName = (name) => {
      // Türkçe karakterleri değiştir
      let slugText = name.toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/Ğ/g, 'G')
        .replace(/Ü/g, 'U')
        .replace(/Ş/g, 'S')
        .replace(/İ/g, 'I')
        .replace(/Ö/g, 'O')
        .replace(/Ç/g, 'C');
      
      // Boşlukları ve özel karakterleri tire ile değiştir
      slugText = slugText.replace(/\s+/g, '-')           // Boşlukları tire ile değiştir
                .replace(/[^\w\-]+/g, '')        // Alfanümerik olmayan karakterleri kaldır
                .replace(/\-\-+/g, '-')          // Birden fazla tireyi tek tire yap
                .replace(/^-+/, '')              // Baştaki tireleri kaldır
                .replace(/-+$/, '');             // Sondaki tireleri kaldır
      
      return slugText;
    };
    
    // Form verilerini doğru tiplere dönüştür
    const restaurantData = {
      name,
      slug: slug || createSlugFromName(name),
      address,
      phone, // Telefon alanı eklendi
      description: description || '',
      imageUrl,
      isActive: isActive === 'true' || isActive === true,
      facilityType: facilityType || 'social' // Varsayılan olarak sosyal tesis
    };
    
    debugLog('Creating restaurant with data:', restaurantData);
    
    const restaurant = new Restaurant(restaurantData);
    const createdRestaurant = await restaurant.save();
    
    debugLog('Restaurant created successfully', createdRestaurant);
    res.status(201).json(createdRestaurant);
  } catch (error) {
    console.error('Restaurant creation error:', error);
    
    // Daha detaylı hata mesajları
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation Error', 
        details: Object.values(error.errors).map(e => e.message)
      });
    } else if (error.code === 11000) { // Duplicate key error
      return res.status(400).json({ 
        message: 'Bu isim veya slug zaten kullanılıyor. Lütfen farklı bir değer girin.' 
      });
    }
    
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update restaurant
// @route   PUT /api/restaurants/:id
// @access  Private/Admin
export const updateRestaurant = async (req, res) => {
  try {
    debugLog(`Updating restaurant ${req.params.id} with body:`, req.body);
    const { name, address, description, isActive, phone, facilityType } = req.body;
    
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    // Form verilerini doğru tiplere dönüştür
    restaurant.name = name || restaurant.name;
    restaurant.address = address || restaurant.address;
    restaurant.phone = phone !== undefined ? phone : restaurant.phone;
    restaurant.description = description !== undefined ? description : restaurant.description;
    restaurant.isActive = isActive === 'true' || isActive === true;
    restaurant.facilityType = facilityType || restaurant.facilityType;
    
    // Update image if new one is uploaded
    if (req.file) {
      debugLog('New image uploaded', { filename: req.file.filename });
      restaurant.imageUrl = `/uploads/${req.file.filename}`;
    }
    
    const updatedRestaurant = await restaurant.save();
    debugLog('Restaurant updated successfully', updatedRestaurant);
    res.json(updatedRestaurant);
  } catch (error) {
    console.error('Restaurant update error:', error);
    
    // Daha detaylı hata mesajları
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation Error', 
        details: Object.values(error.errors).map(e => e.message)
      });
    } else if (error.code === 11000) { // Duplicate key error
      return res.status(400).json({ 
        message: 'Bu isim veya slug zaten kullanılıyor. Lütfen farklı bir değer girin.' 
      });
    }
    
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete restaurant
// @route   DELETE /api/restaurants/:id
// @access  Private/Admin
export const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (restaurant) {
      // Görsel dosyasını da sil
      if (restaurant.imageUrl && restaurant.imageUrl.startsWith('/uploads/')) {
        const imagePath = path.join(__dirname, '..', restaurant.imageUrl);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          debugLog(`Deleted image file: ${imagePath}`);
        }
      }
      
      await restaurant.deleteOne();
      res.json({ message: 'Restaurant removed' });
    } else {
      res.status(404).json({ message: 'Restaurant not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get restaurant by slug
// @route   GET /api/restaurants/slug/:slug
// @access  Public
export const getRestaurantBySlug = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ slug: req.params.slug });
    
    if (restaurant) {
      res.json(restaurant);
    } else {
      res.status(404).json({ message: 'Tesis bulunamadı' });
    }
  } catch (error) {
    console.error('Error fetching restaurant by slug:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};