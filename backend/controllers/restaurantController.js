// backend/controllers/restaurantController.js - Restaurant management
import Restaurant from '../models/Restaurant.js';

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
    const { name, address, description, isActive, slug, phone } = req.body;
    let imageUrl = '';

    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
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
    const restaurant = new Restaurant({
      name,
      slug: slug || createSlugFromName(name),
      address,
      phone, // Telefon alanı eklendi
      description: description || '',
      imageUrl,
      isActive: isActive !== undefined ? isActive : true,
    });

    const createdRestaurant = await restaurant.save();
    res.status(201).json(createdRestaurant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update restaurant
// @route   PUT /api/restaurants/:id
// @access  Private/Admin
export const updateRestaurant = async (req, res) => {
  try {
    const { name, address, description, isActive, phone } = req.body;
    
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (restaurant) {
      restaurant.name = name || restaurant.name;
      restaurant.address = address || restaurant.address;
      restaurant.phone = phone !== undefined ? phone : restaurant.phone; // Telefon alanı eklendi
      restaurant.description = description !== undefined ? description : restaurant.description;
      restaurant.isActive = isActive !== undefined ? isActive : restaurant.isActive;
      
      // Update image if new one is uploaded
      if (req.file) {
        restaurant.imageUrl = `/uploads/${req.file.filename}`;
      }
      
      const updatedRestaurant = await restaurant.save();
      res.json(updatedRestaurant);
    } else {
      res.status(404).json({ message: 'Restaurant not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete restaurant
// @route   DELETE /api/restaurants/:id
// @access  Private/Admin
export const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (restaurant) {
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

// backend/controllers/restaurantController.js - Slug ile tesis getirme fonksiyonu ekle
// Mevcut fonksiyonlar korunarak, yeni getRestaurantBySlug fonksiyonu ekleniyor

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