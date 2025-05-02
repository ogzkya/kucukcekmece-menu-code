// backend/controllers/categoryController.js - Hata yönetimi iyileştirilmiş
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
    console.log(`[CategoryController] ${message}`);
    if (data) console.log(JSON.stringify(data, null, 2));
  }
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort('orderIndex');
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all categories (including inactive for admin)
// @route   GET /api/categories/admin
// @access  Private/Admin
export const getAdminCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort('orderIndex');
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get categories by facility type
// @route   GET /api/categories/facility/:facilityType
// @access  Public
export const getCategoriesByFacilityType = async (req, res) => {
  try {
    const { facilityType } = req.params;
    
    const categories = await Category.find({ 
      isActive: true,
      facilityType
    }).sort('orderIndex');
    
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get category by ID
// @route   GET /api/categories/:id
// @access  Public
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req, res) => {
  try {
    debugLog('Creating category with body:', req.body);
    const { name, orderIndex, isActive, facilityType } = req.body;
    
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Category name is required' });
    }
    
    let imageUrl = '';

    if (req.file) {
      // Image path for frontend access
      imageUrl = `/uploads/${req.file.filename}`;
      debugLog('Image uploaded', { filename: req.file.filename, path: imageUrl });
    } else {
      return res.status(400).json({ message: 'Please upload an image' });
    }
    
    // Form verilerini doğru tiplere dönüştür
    const categoryData = {
      name,
      imageUrl,
      orderIndex: orderIndex ? parseInt(orderIndex, 10) : 0,
      isActive: isActive === 'true' || isActive === true,
      facilityType: facilityType || FACILITY_TYPES.SOCIAL
    };
    
    debugLog('Creating category with data:', categoryData);
    
    const category = new Category(categoryData);
    const createdCategory = await category.save();
    
    debugLog('Category created successfully', createdCategory);
    res.status(201).json(createdCategory);
  } catch (error) {
    console.error('Category creation error:', error);
    
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

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res) => {
  try {
    debugLog(`Updating category ${req.params.id} with body:`, req.body);
    const { name, orderIndex, isActive, facilityType } = req.body;
    
    const category = await Category.findById(req.params.id);
    
    if (category) {
      // Form verilerini doğru tiplere dönüştür
      category.name = name || category.name;
      category.orderIndex = orderIndex !== undefined ? parseInt(orderIndex, 10) : category.orderIndex;
      category.isActive = isActive === 'true' || isActive === true;
      category.facilityType = facilityType || category.facilityType;
      
      // Update image if new one is uploaded
      if (req.file) {
        debugLog('New image uploaded', { filename: req.file.filename });
        category.imageUrl = `/uploads/${req.file.filename}`;
      }
      
      const updatedCategory = await category.save();
      debugLog('Category updated successfully', updatedCategory);
      res.json(updatedCategory);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    console.error('Category update error:', error);
    
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

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (category) {
      // Görsel dosyasını da sil
      if (category.imageUrl && category.imageUrl.startsWith('/uploads/')) {
        const imagePath = path.join(__dirname, '..', category.imageUrl);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          debugLog(`Deleted image file: ${imagePath}`);
        }
      }
      
      await category.deleteOne();
      res.json({ message: 'Category removed' });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};