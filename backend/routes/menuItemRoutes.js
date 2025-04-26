// backend/routes/menuItemRoutes.js - Menu item routes
import express from 'express';
import {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuItemsByCategory,
  getAdminMenuItems,
} from '../controllers/menuItemController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getMenuItems)
  .post(protect, admin, upload.single('image'), createMenuItem);

router.get('/admin', protect, admin, getAdminMenuItems);
router.get('/category/:categoryId', getMenuItemsByCategory);

router.route('/:id')
  .get(getMenuItemById)
  .put(protect, admin, upload.single('image'), updateMenuItem)
  .delete(protect, admin, deleteMenuItem);

export default router;
