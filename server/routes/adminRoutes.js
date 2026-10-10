import express from 'express';
import {
  getAdminStats,
  getUsers,
  updateUserRole,
  deleteUser,
  createGenre,
  deleteGenre,
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, admin);

router.get('/stats', getAdminStats);
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.post('/genres', createGenre);
router.delete('/genres/:id', deleteGenre);

export default router;
