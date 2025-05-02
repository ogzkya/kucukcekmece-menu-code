// backend/controllers/menuItemController.js - Hata yönetimi ve form veri işleme düzeltildi
import MenuItem from '../models/MenuItem.js';
import Category from '../models/Category.js';
import { FACILITY_TYPES } from '../models/constants.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module için __dirname oluştur
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Debug logger
const debugLog = (message, data = null) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[MenuItemController] ${message}`);
    if (data) console.log(JSON.stringify(data, null, 2));
  }
};

// @desc    Get all menu items 
// @route   GET /api/menu-items
// @access  Public
export const getMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ isActive: true })
      .populate('category', 'name')
      .sort('orderIndex');
      
    res.json(menuItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all menu items for admin
// @route   GET /api/menu-items/admin
// @access  Private/Admin
export const getAdminMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({})
      .populate('category', 'name')
      .sort('orderIndex');
      
    res.json(menuItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get menu items by category
// @route   GET /api/menu-items/category/:categoryId
// @access  Public
export const getMenuItemsByCategory = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ 
      category: req.params.categoryId,
      isActive: true
    }).sort('orderIndex');
    
    res.json(menuItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get menu items by facility type
// @route   GET /api/menu-items/facility/:facilityType
// @access  Public
export const getMenuItemsByFacilityType = async (req, res) => {
  try {
    const { facilityType } = req.params;
    
    const menuItems = await MenuItem.find({ 
      isActive: true,
      facilityType
    })
      .populate('category', 'name')
      .sort('orderIndex');
      
    res.json(menuItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get menu items by category and facility type
// @route   GET /api/menu-items/category/:categoryId/facility/:facilityType
// @access  Public
export const getMenuItemsByCategoryAndFacilityType = async (req, res) => {
  try {
    const { categoryId, facilityType } = req.params;
    
    const menuItems = await MenuItem.find({ 
      category: categoryId,
      isActive: true,
      facilityType
    }).sort('orderIndex');
    
    res.json(menuItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get menu item by ID
// @route   GET /api/menu-items/:id
// @access  Public
export const getMenuItemById = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id)
      .populate('category', 'name');
    
    if (menuItem) {
      res.json(menuItem);
    } else {
      res.status(404).json({ message: 'Menu item not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create menu item
// @route   POST /api/menu-items
// @access  Private/Admin
export const createMenuItem = async (req, res) => {
  try {
    debugLog('Creating menu item with body:', req.body);
    
    const { 
      name, 
      description, 
      price, 
      category, 
      allergens,
      weight,
      orderIndex,
      isActive,
      facilityType 
    } = req.body;
    
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Menu item name is required' });
    }
    
    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }
    
    let imageUrl = '';

    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
      debugLog('Image uploaded', { filename: req.file.filename, path: imageUrl });
    } else {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    // İlgili kategoriyi bul
    let categoryFacilityType = FACILITY_TYPES.SOCIAL; // Varsayılan değer
    
    if (category) {
      const categoryObj = await Category.findById(category);
      if (categoryObj) {
        categoryFacilityType = categoryObj.facilityType || FACILITY_TYPES.SOCIAL;
      } else {
        return res.status(404).json({ message: 'Category not found' });
      }
    }

    // Parse allergens if it's a string
    let allergensArray = allergens;
    if (typeof allergens === 'string') {
      allergensArray = allergens.split(',').map(item => item.trim());
    }

    // Form verilerini doğru tiplere dönüştür
    const menuItemData = {
      name,
      description: description || '',
      price: parseFloat(price) || 0,
      imageUrl,
      weight: weight || '',
      category,
      allergens: allergensArray || [],
      orderIndex: parseInt(orderIndex) || 0,
      isActive: isActive === 'true' || isActive === true,
      facilityType: facilityType || categoryFacilityType
    };
    
    debugLog('Creating menu item with data:', menuItemData);

    const menuItem = new MenuItem(menuItemData);
    const createdMenuItem = await menuItem.save();
    
    debugLog('Menu item created successfully', createdMenuItem);
    res.status(201).json(createdMenuItem);
  } catch (error) {
    console.error('Menu item creation error:', error);
    
    // Daha detaylı hata mesajları
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation Error', 
        details: Object.values(error.errors).map(e => e.message)
      });
    }
    
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update menu item
// @route   PUT /api/menu-items/:id
// @access  Private/Admin
export const updateMenuItem = async (req, res) => {
  try {
    debugLog(`Updating menu item ${req.params.id} with body:`, req.body);
    
    const { 
      name, 
      description, 
      price, 
      category, 
      allergens,
      weight,
      orderIndex,
      isActive,
      facilityType
    } = req.body;
    
    const menuItem = await MenuItem.findById(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    // Kategori değiştiyse, yeni kategoriyi kontrol et
    let categoryFacilityType = null;
    if (category && category !== menuItem.category.toString()) {
      const categoryObj = await Category.findById(category);
      if (!categoryObj) {
        return res.status(404).json({ message: 'Category not found' });
      }
      
      // Kategori değiştiyse ve facilityType belirtilmediyse, kategorinin facilityType'ını kullan
      categoryFacilityType = categoryObj.facilityType;
    }
    
    // Form verilerini doğru tiplere dönüştür
    menuItem.name = name || menuItem.name;
    menuItem.description = description !== undefined ? description : menuItem.description;
    menuItem.price = price !== undefined ? parseFloat(price) : menuItem.price;
    menuItem.weight = weight !== undefined ? weight : menuItem.weight;
    menuItem.category = category || menuItem.category;
    menuItem.orderIndex = orderIndex !== undefined ? parseInt(orderIndex) : menuItem.orderIndex;
    menuItem.isActive = isActive === 'true' || isActive === true;
    
    // Kategori değiştiyse ve facilityType belirtilmediyse, kategorinin facilityType'ını kullan
    if (categoryFacilityType && !facilityType) {
      menuItem.facilityType = categoryFacilityType;
    } else {
      menuItem.facilityType = facilityType || menuItem.facilityType;
    }
    
    // Parse allergens if it's a string
    if (allergens) {
      if (typeof allergens === 'string') {
        menuItem.allergens = allergens.split(',').map(item => item.trim());
      } else {
        menuItem.allergens = allergens;
      }
    }
    
    // Update image if new one is uploaded
    if (req.file) {
      debugLog('New image uploaded', { filename: req.file.filename });
      menuItem.imageUrl = `/uploads/${req.file.filename}`;
    }
    
    const updatedMenuItem = await menuItem.save();
    debugLog('Menu item updated successfully', updatedMenuItem);
    res.json(updatedMenuItem);
  } catch (error) {
    console.error('Menu item update error:', error);
    
    // Daha detaylı hata mesajları
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation Error', 
        details: Object.values(error.errors).map(e => e.message)
      });
    }
    
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete menu item
// @route   DELETE /api/menu-items/:id
// @access  Private/Admin
export const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    
    if (menuItem) {
      // Görsel dosyasını da sil
      if (menuItem.imageUrl && menuItem.imageUrl.startsWith('/uploads/')) {
        const imagePath = path.join(__dirname, '..', menuItem.imageUrl);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          debugLog(`Deleted image file: ${imagePath}`);
        }
      }
      
      await menuItem.deleteOne();
      res.json({ message: 'Menu item removed' });
    } else {
      res.status(404).json({ message: 'Menu item not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};