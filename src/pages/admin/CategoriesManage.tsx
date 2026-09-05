import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { Category, AdminNavPage } from '../../types.ts';
import {
  Tags,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  FolderPlus,
} from 'lucide-react';

interface CategoriesManageProps {
  onNavigate: (page: AdminNavPage) => void;
}

export const CategoriesManage: React.FC<CategoriesManageProps> = () => {
  const { showToast } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await api.getCategories();
      setCategories(res.categories);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!newCategoryName.trim()) {
      setError('Please enter a valid category name.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.createCategory(newCategoryName.trim());
      setCategories((prev) => [...prev, res.category]);
      setNewCategoryName('');
      showToast('success', `Category "${res.category.name}" added successfully.`, 'Category Added');
    } catch (err: any) {
      setError(err.message || 'Failed to add category.');
      showToast('error', err.message || 'Failed to add category.', 'Error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (cat: Category) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the category "${cat.name}"?`
      )
    ) {
      return;
    }

    try {
      await api.deleteCategory(cat.id);
      setCategories((prev) => prev.filter((c) => c.id !== cat.id));
      showToast('info', `Category "${cat.name}" removed.`, 'Category Removed');
    } catch (err: any) {
      showToast('error', err.message || 'Failed to delete category.', 'Error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Complaint Categories</h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
          Manage campus facility classification taxonomy available to students when lodging
          complaints.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1 Col: Add New Category Form */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 p-6 shadow-xs h-fit">
          <h3 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2">
            <FolderPlus className="w-4 h-4 text-[#1E3A8A]" />
            <span>Create New Category</span>
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Add a new facility or service classification to the campus system.
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAddCategory} className="space-y-4">
            <div>
              <label
                htmlFor="new-category-name"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"
              >
                Category Name
              </label>
              <input
                id="new-category-name"
                type="text"
                required
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g. Sports Equipment, HVAC"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] bg-white placeholder:text-slate-400"
              />
            </div>

            <button
              id="add-category-btn"
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-[#1E3A8A] hover:bg-blue-800 text-white text-xs font-semibold disabled:opacity-50 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>{submitting ? 'Creating...' : 'Add Category'}</span>
            </button>
          </form>
        </div>

        {/* Right 2 Cols: Category List */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="font-bold text-slate-700">Active Categories</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Total categories configured: {categories.length}
              </p>
            </div>
            <button
              onClick={loadCategories}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              title="Refresh categories"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400">Loading categories...</div>
          ) : categories.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">No categories found.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {categories.map((cat, idx) => (
                <div
                  key={cat.id}
                  id={`category-item-${cat.id}`}
                  className="p-4 px-6 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 font-mono text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <Tags className="w-4 h-4 text-[#1E3A8A]" />
                      <span className="font-semibold text-slate-800 text-sm">{cat.name}</span>
                    </div>
                  </div>

                  <button
                    id={`delete-category-btn-${cat.id}`}
                    onClick={() => handleDeleteCategory(cat)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title={`Delete category ${cat.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
