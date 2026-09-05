import { Router } from 'express';
import { getStudents } from '../controllers/userController.ts';
import { authenticateToken, requireAdmin } from '../middleware/auth.ts';

const router = Router();

router.get('/students', authenticateToken, requireAdmin, getStudents);

export default router;
