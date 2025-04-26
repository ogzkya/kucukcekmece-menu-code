// backend/controllers/menuItemController.js - Menu Item management
import MenuItem from '../models/MenuItem.js';

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
      isActive 
    } = req.body;
    
    let imageUrl = '';

    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    } else {
      return res.status(400).json({ message: 'Please upload an image' });
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
      isActive 
    } = req.body;
    
    const menuItem = await MenuItem.findById(req.params.id);
    
    if (menuItem) {
      menuItem.name = name || menuItem.name;
      menuItem.description = description !== undefined ? description : menuItem.description;
      menuItem.price = price !== undefined ? price : menuItem.price;
      menuItem.weight = weight !== undefined ? weight : menuItem.weight;
      menuItem.category = category || menuItem.category;
      menuItem.orderIndex = orderIndex !== undefined ? orderIndex : menuItem.orderIndex;
      menuItem.isActive = isActive !== undefined ? isActive : menuItem.isActive;
      
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