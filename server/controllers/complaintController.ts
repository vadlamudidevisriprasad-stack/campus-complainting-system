import { Response } from 'express';
import { db } from '../config/db.ts';
import { AuthenticatedRequest } from '../middleware/auth.ts';

export const createComplaint = (req: AuthenticatedRequest, res: Response): void => {
  try {
    if (!req.user || req.user.role !== 'student') {
      res.status(403).json({ error: 'Only registered students can raise complaints.' });
      return;
    }

    const { title, description, category, location } = req.body;

    if (!title || !description || !category || !location) {
      res.status(400).json({
        error: 'Title, description, category, and location are required fields.',
      });
      return;
    }

    let imageUrl: string | undefined = undefined;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }

    const newComplaint = db.createComplaint({
      studentId: req.user.id,
      studentName: req.user.name,
      studentRollNo: req.user.rollNumber,
      studentDept: req.user.department,
      title,
      description,
      category,
      location,
      image: imageUrl,
    });

    res.status(201).json({
      message: 'Complaint submitted successfully',
      complaint: newComplaint,
    });
  } catch (error) {
    console.error('Create complaint error:', error);
    res.status(500).json({ error: 'Failed to create complaint.' });
  }
};

export const getMyComplaints = (req: AuthenticatedRequest, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated.' });
      return;
    }

    const { status, category, search } = req.query;
    let list = db.getComplaintsByStudent(req.user.id);

    if (status && status !== 'All') {
      list = list.filter((c) => c.status.toLowerCase() === (status as string).toLowerCase());
    }

    if (category && category !== 'All') {
      list = list.filter((c) => c.category === category);
    }

    if (search) {
      const q = (search as string).toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.ticketNumber.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q)
      );
    }

    res.json({ complaints: list });
  } catch (error) {
    console.error('Get my complaints error:', error);
    res.status(500).json({ error: 'Failed to retrieve complaints.' });
  }
};

export const getAllComplaints = (req: AuthenticatedRequest, res: Response): void => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({ error: 'Access denied: Admin only.' });
      return;
    }

    const { status, category, search, date } = req.query;
    let list = db.getComplaints();

    if (status && status !== 'All') {
      list = list.filter((c) => c.status.toLowerCase() === (status as string).toLowerCase());
    }

    if (category && category !== 'All') {
      list = list.filter((c) => c.category === category);
    }

    if (date) {
      list = list.filter((c) => c.createdAt.startsWith(date as string));
    }

    if (search) {
      const q = (search as string).toLowerCase();
      list = list.filter(
        (c) =>
          c.studentName.toLowerCase().includes(q) ||
          c.ticketNumber.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          (c.studentRollNo && c.studentRollNo.toLowerCase().includes(q)) ||
          c.location.toLowerCase().includes(q)
      );
    }

    res.json({ complaints: list });
  } catch (error) {
    console.error('Get all complaints error:', error);
    res.status(500).json({ error: 'Failed to fetch complaints list.' });
  }
};

export const getComplaintById = (req: AuthenticatedRequest, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated.' });
      return;
    }

    const { id } = req.params;
    const complaint = db.getComplaintById(id);

    if (!complaint) {
      res.status(404).json({ error: 'Complaint not found.' });
      return;
    }

    // Role check: A student can ONLY view their own complaints
    if (req.user.role === 'student' && complaint.studentId !== req.user.id) {
      res.status(403).json({
        error: 'Access denied: You do not have permission to view other students complaints.',
      });
      return;
    }

    res.json({ complaint });
  } catch (error) {
    console.error('Get complaint error:', error);
    res.status(500).json({ error: 'Failed to get complaint details.' });
  }
};

export const updateComplaintStatusAndRemark = (
  req: AuthenticatedRequest,
  res: Response
): void => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({ error: 'Access denied: Admin privileges required.' });
      return;
    }

    const { id } = req.params;
    const { status, adminRemark } = req.body;

    const validStatuses = ['Pending', 'In Progress', 'Resolved'];
    if (status && !validStatuses.includes(status)) {
      res.status(400).json({
        error: 'Invalid status. Allowed values: Pending, In Progress, Resolved.',
      });
      return;
    }

    const updated = db.updateComplaint(id, {
      status,
      adminRemark,
    });

    if (!updated) {
      res.status(404).json({ error: 'Complaint not found.' });
      return;
    }

    res.json({
      message: 'Complaint updated successfully',
      complaint: updated,
    });
  } catch (error) {
    console.error('Update complaint error:', error);
    res.status(500).json({ error: 'Failed to update complaint.' });
  }
};

export const getDashboardStats = (req: AuthenticatedRequest, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated.' });
      return;
    }

    const isStudent = req.user.role === 'student';
    const complaints = isStudent ? db.getComplaintsByStudent(req.user.id) : db.getComplaints();

    const total = complaints.length;
    const pending = complaints.filter((c) => c.status === 'Pending').length;
    const inProgress = complaints.filter((c) => c.status === 'In Progress').length;
    const resolved = complaints.filter((c) => c.status === 'Resolved').length;

    const recent = complaints.slice(0, 5);

    // If admin, compute category breakdown
    let categoryCounts: Record<string, number> = {};
    if (!isStudent) {
      const allCategories = db.getCategories();
      allCategories.forEach((cat) => {
        categoryCounts[cat.name] = 0;
      });
      complaints.forEach((c) => {
        categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
      });
    }

    res.json({
      stats: {
        total,
        pending,
        inProgress,
        resolved,
      },
      recentComplaints: recent,
      categoryBreakdown: !isStudent ? categoryCounts : undefined,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to load dashboard statistics.' });
  }
};
