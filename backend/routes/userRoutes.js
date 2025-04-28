// backend/routes/userRoutes.js
import express from 'express';
import { 
  getAdminUsers,
  createAdminUser,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin kullanıcı yönetimi route'ları
router.route('/admins')
  .get(protect, admin, getAdminUsers);

router.route('/admin')
  .post(protect, admin, createAdminUser);

router.route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

export default router;