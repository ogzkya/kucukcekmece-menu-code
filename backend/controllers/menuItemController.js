// backend/controllers/menuItemController.js - Tesis tipi ile ilgili fonksiyonlar eklendi
import MenuItem from '../models/MenuItem.js';
import Category from '../models/Category.js';
import { FACILITY_TYPES } from '../models/Restaurant.js';
import { FACILITY_TYPES } from '../models/constants.js';

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
    
    let imageUrl = '';

    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    } else {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    // İlgili kategoriyi bul
    let categoryFacilityType = FACILITY_TYPES.SOCIAL; // Varsayılan değer
    
    if (category) {
      const categoryObj = await Category.findById(category);
      if (categoryObj) {
        categoryFacilityType = categoryObj.facilityType || FACILITY_TYPES.SOCIAL;
      }
    }

    // Parse allergens if it's a string
    let allergensArray = allergens;
    if (typeof allergens === 'string') {
      allergensArray = allergens.split(',').map(item => item.trim());
    }

    const menuItem = new MenuItem({
      name,
      description: description || '',
      price: price || 0,
      imageUrl,
      weight: weight || '',
      category,
      allergens: allergensArray || [],
      orderIndex: orderIndex || 0,
      isActive: isActive !== undefined ? isActive : true,
      facilityType: facilityType || categoryFacilityType
    });

    const createdMenuItem = await menuItem.save();
    res.status(201).json(createdMenuItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update menu item
// @route   PUT /api/menu-items/:id
// @access  Private/Admin
export const updateMenuItem = async (req, res) => {
  try {
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
    
    if (menuItem) {
      // Kategori değiştiyse, yeni kategoriyi kontrol et
      if (category && category !== menuItem.category.toString()) {
        const categoryObj = await Category.findById(category);
        if (!categoryObj) {
          return res.status(404).json({ message: 'Category not found' });
        }
        
        // Kategori değiştiyse ve facilityType belirtilmediyse, kategorinin facilityType'ını kullan
        if (!facilityType) {
          menuItem.facilityType = categoryObj.facilityType;
        }
      }
      
      menuItem.name = name || menuItem.name;
      menuItem.description = description !== undefined ? description : menuItem.description;
      menuItem.price = price !== undefined ? price : menuItem.price;
      menuItem.weight = weight !== undefined ? weight : menuItem.weight;
      menuItem.category = category || menuItem.category;
      menuItem.orderIndex = orderIndex !== undefined ? orderIndex : menuItem.orderIndex;
      menuItem.isActive = isActive !== undefined ? isActive : menuItem.isActive;
      menuItem.facilityType = facilityType || menuItem.facilityType;
      
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
        menuItem.imageUrl = `/uploads/${req.file.filename}`;
      }
      
      const updatedMenuItem = await menuItem.save();
      res.json(updatedMenuItem);
    } else {
      res.status(404).json({ message: 'Menu item not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete menu item
// @route   DELETE /api/menu-items/:id
// @access  Private/Admin
export const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    
    if (menuItem) {
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