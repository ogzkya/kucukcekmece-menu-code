// backend/controllers/categoryController.js - Tesis tipi ile ilgili fonksiyonlar eklendi
import Category from '../models/Category.js';

import { FACILITY_TYPES } from '../models/constants.js';

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
    const { name, orderIndex, isActive, facilityType } = req.body;
    let imageUrl = '';

    if (req.file) {
      // Image path for frontend access
      imageUrl = `/uploads/${req.file.filename}`;
    } else {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    const category = new Category({
      name,
      imageUrl,
      orderIndex: orderIndex || 0,
      isActive: isActive !== undefined ? isActive : true,
      facilityType: facilityType || FACILITY_TYPES.SOCIAL
    });

    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res) => {
  try {
    const { name, orderIndex, isActive, facilityType } = req.body;
    
    const category = await Category.findById(req.params.id);
    
    if (category) {
      category.name = name || category.name;
      category.orderIndex = orderIndex !== undefined ? orderIndex : category.orderIndex;
      category.isActive = isActive !== undefined ? isActive : category.isActive;
      category.facilityType = facilityType || category.facilityType;
      
      // Update image if new one is uploaded
      if (req.file) {
        category.imageUrl = `/uploads/${req.file.filename}`;
      }
      
      const updatedCategory = await category.save();
      res.json(updatedCategory);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (category) {
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