import { Router } from 'express';
import {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getComplaintById,
  updateComplaintStatusAndRemark,
  getDashboardStats,
} from '../controllers/complaintController.ts';
import { authenticateToken, requireAdmin, requireStudent } from '../middleware/auth.ts';
import { upload } from '../middleware/upload.ts';

const router = Router();

// Stats (used by both student and admin)
router.get('/stats', authenticateToken, getDashboardStats);

// Student complaints
router.post(
  '/',
  authenticateToken,
  requireStudent,
  upload.single('image'),
  createComplaint
);
router.get('/my', authenticateToken, requireStudent, getMyComplaints);

// Admin complaints
router.get('/all', authenticateToken, requireAdmin, getAllComplaints);
router.patch(
  '/:id/status',
  authenticateToken,
  requireAdmin,
  updateComplaintStatusAndRemark
);

// Single complaint details (role protected inside controller)
router.get('/:id', authenticateToken, getComplaintById);

export default router;
