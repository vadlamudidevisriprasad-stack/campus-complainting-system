import { Router } from 'express';
import {
  registerStudent,
  login,
  getMe,
  updateProfile,
} from '../controllers/authController.ts';
import { authenticateToken } from '../middleware/auth.ts';

const router = Router();

router.post('/register', registerStudent);
router.post('/login', login);
router.get('/me', authenticateToken, getMe);
router.put('/profile', authenticateToken, updateProfile);

export default router;
