// backend/routes/restaurantRoutes.js - Restaurant routes
import express from 'express';
import {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getAdminRestaurants,
  getRestaurantBySlug
} from '../controllers/restaurantController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getRestaurants)
  .post(protect, admin, upload.single('image'), createRestaurant);

router.get('/admin', protect, admin, getAdminRestaurants);
router.get('/slug/:slug', getRestaurantBySlug);

router.route('/:id')
  .get(getRestaurantById)
  .put(protect, admin, upload.single('image'), updateRestaurant)
  .delete(protect, admin, deleteRestaurant);

export default router;