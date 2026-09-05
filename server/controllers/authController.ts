import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/db.ts';
import { JWT_SECRET, AuthenticatedRequest } from '../middleware/auth.ts';

export const registerStudent = (req: Request, res: Response): void => {
  try {
    const { name, email, password, department, year, rollNumber } = req.body;

    if (!name || !email || !password || !department || !year || !rollNumber) {
      res.status(400).json({ error: 'All fields are required for student registration.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters long.' });
      return;
    }

    const existing = db.getUserByEmail(email);
    if (existing) {
      res.status(400).json({ error: 'A user with this email address already exists.' });
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = db.createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: 'student',
      department: department.trim(),
      year: year.trim(),
      rollNumber: rollNumber.trim().toUpperCase(),
    });

    const token = jwt.sign(
      { id: newUser.id, role: newUser.role, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...safeUser } = newUser;
    res.status(201).json({
      message: 'Student registered successfully',
      token,
      user: safeUser,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error while processing registration.' });
  }
};

export const login = (req: Request, res: Response): void => {
  try {
    const { email, password, role: requiredRole } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }

    const user = db.getUserByEmail(email);
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    // Role verification if requested from role-specific portal
    if (requiredRole && user.role !== requiredRole) {
      if (requiredRole === 'admin' && user.role === 'student') {
        res.status(403).json({
          error: 'Access Denied: You cannot log into the Admin portal with a Student account.',
        });
        return;
      }
      if (requiredRole === 'student' && user.role === 'admin') {
        res.status(403).json({
          error: 'Please log in through the Admin Portal.',
        });
        return;
      }
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...safeUser } = user;
    res.json({
      message: 'Login successful',
      token,
      user: safeUser,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error while logging in.' });
  }
};

export const getMe = (req: AuthenticatedRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  const { password: _, ...safeUser } = req.user;
  res.json({ user: safeUser });
};

export const updateProfile = (req: AuthenticatedRequest, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { name, department, year, rollNumber } = req.body;

    const updated = db.updateUser(req.user.id, {
      name: name?.trim() || req.user.name,
      department: department?.trim() || req.user.department,
      year: year?.trim() || req.user.year,
      rollNumber: rollNumber?.trim() || req.user.rollNumber,
    });

    if (!updated) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const { password: _, ...safeUser } = updated;
    res.json({
      message: 'Profile updated successfully',
      user: safeUser,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error while updating profile.' });
  }
};
