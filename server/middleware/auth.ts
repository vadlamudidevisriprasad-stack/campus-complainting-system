import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db, IUser } from '../config/db.ts';

export const JWT_SECRET = process.env.JWT_SECRET || 'campus-complaint-jwt-secret-key-2026';

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    res.status(401).json({ error: 'Authentication token is required. Please log in.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
    const user = db.getUserById(decoded.id);

    if (!user) {
      res.status(401).json({ error: 'User associated with this token no longer exists.' });
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired authentication token.' });
    return;
  }
};

export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated.' });
    return;
  }

  if (req.user.role !== 'admin') {
    res.status(403).json({
      error: 'Access denied: Students are strictly forbidden from accessing admin resources.',
    });
    return;
  }

  next();
};

export const requireStudent = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated.' });
    return;
  }

  if (req.user.role !== 'student') {
    res.status(403).json({ error: 'Access denied: Student account required.' });
    return;
  }

  next();
};
