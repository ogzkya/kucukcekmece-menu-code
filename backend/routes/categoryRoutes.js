// backend/routes/categoryRoutes.js - Tesis tipi rotası eklendi
import express from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getAdminCategories,
  getCategoriesByFacilityType
} from '../controllers/categoryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getCategories)
  .post(protect, admin, upload.single('image'), createCategory);

router.get('/admin', protect, admin, getAdminCategories);
router.get('/facility/:facilityType', getCategoriesByFacilityType);

router.route('/:id')
  .get(getCategoryById)
  .put(protect, admin, upload.single('image'), updateCategory)
  .delete(protect, admin, deleteCategory);

export default router;