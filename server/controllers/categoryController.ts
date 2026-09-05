import { Request, Response } from 'express';
import { db } from '../config/db.ts';

export const getCategories = (_req: Request, res: Response): void => {
  try {
    const categories = db.getCategories();
    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories.' });
  }
};

export const createCategory = (req: Request, res: Response): void => {
  try {
    const { name } = req.body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      res.status(400).json({ error: 'Category name is required.' });
      return;
    }

    const existing = db.getCategories().find(
      (c) => c.name.toLowerCase() === name.trim().toLowerCase()
    );
    if (existing) {
      res.status(400).json({ error: 'Category with this name already exists.' });
      return;
    }

    const category = db.createCategory(name.trim());
    res.status(201).json({ message: 'Category created successfully', category });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Failed to create category.' });
  }
};

export const deleteCategory = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const deleted = db.deleteCategory(id);
    if (!deleted) {
      res.status(404).json({ error: 'Category not found.' });
      return;
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Failed to delete category.' });
  }
};
