import { Response } from 'express';
import { db } from '../config/db.ts';
import { AuthenticatedRequest } from '../middleware/auth.ts';

export const getStudents = (req: AuthenticatedRequest, res: Response): void => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({ error: 'Access denied: Admin only.' });
      return;
    }

    const allUsers = db.getUsers();
    const students = allUsers.filter((u) => u.role === 'student');
    const complaints = db.getComplaints();

    const studentListWithCounts = students.map((student) => {
      const studentComplaints = complaints.filter((c) => c.studentId === student.id);
      const { password: _, ...safeStudent } = student;
      return {
        ...safeStudent,
        complaintCount: studentComplaints.length,
        pendingCount: studentComplaints.filter((c) => c.status === 'Pending').length,
        resolvedCount: studentComplaints.filter((c) => c.status === 'Resolved').length,
      };
    });

    res.json({ students: studentListWithCounts });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ error: 'Failed to retrieve registered students.' });
  }
};
