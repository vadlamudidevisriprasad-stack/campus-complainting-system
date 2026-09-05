import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { Category, StudentNavPage } from '../../types.ts';
import {
  PlusCircle,
  UploadCloud,
  X,
  MapPin,
  Tag,
  FileText,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface RaiseComplaintProps {
  onNavigate: (page: StudentNavPage, complaintId?: string) => void;
}

const LOCATION_SUGGESTIONS = [
  'Main Block',
  'CSE Block',
  'ECE Block',
  'Mechanical Block',
  'Library',
  'Hostel',
  'Cafeteria',
  'Parking',
  'College Bus',
];

export const RaiseComplaint: React.FC<RaiseComplaintProps> = ({ onNavigate }) => {
  const { showToast } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await api.getCategories();
        setCategories(res.categories);
        if (res.categories.length > 0) {
          setCategory(res.categories[0].name);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    loadCategories();
  }, []);

  const handleImageChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('error', 'Please upload an image file (JPG, PNG, WEBP)', 'Invalid File');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('error', 'Image size must be less than 5MB', 'File Too Large');
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageChange(e.dataTransfer.files[0]);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title.trim()) {
      setErrorMessage('Please provide a complaint title.');
      return;
    }
    if (!category) {
      setErrorMessage('Please choose a complaint category.');
      return;
    }
    if (!location.trim()) {
      setErrorMessage('Please specify the campus location.');
      return;
    }
    if (!description.trim()) {
      setErrorMessage('Please provide a detailed description.');
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('category', category);
      formData.append('location', location.trim());
      formData.append('description', description.trim());
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const res = await api.createComplaint(formData);
      showToast(
        'success',
        `Complaint ticket ${res.complaint.ticketNumber} lodged successfully!`,
        'Ticket Created'
      );
      onNavigate('complaint-details', res.complaint.id);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit complaint. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Lodge Campus Facility Complaint
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Submit details regarding broken equipment, connectivity failures, electrical hazards, or
          maintenance issues across campus grounds.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 sm:p-8">
        {errorMessage && (
          <div
            id="raise-complaint-error"
            className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Complaint Title */}
          <div>
            <label
              htmlFor="complaint-title-input"
              className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1.5"
            >
              Complaint Title <span className="text-rose-500">*</span>
            </label>
            <div className="relative rounded-lg shadow-2xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <FileText className="w-4 h-4" />
              </div>
              <input
                id="complaint-title-input"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Projector in ECE Seminar Hall 3 not turning on"
                className="block w-full pl-10 pr-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-900 focus:border-blue-900 bg-white placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Category and Location in grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Category */}
            <div>
              <label
                htmlFor="complaint-category-select"
                className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1.5"
              >
                Complaint Category <span className="text-rose-500">*</span>
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Tag className="w-4 h-4" />
                </div>
                <select
                  id="complaint-category-select"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-900 focus:border-blue-900 bg-white text-slate-800"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="complaint-location-input"
                className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1.5"
              >
                Campus Location <span className="text-rose-500">*</span>
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  id="complaint-location-input"
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. CSE Block, 2nd Floor Room 210"
                  className="block w-full pl-10 pr-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-900 focus:border-blue-900 bg-white placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Quick Location Chips */}
          <div>
            <span className="block text-[11px] text-slate-500 mb-1.5">
              Quick campus location select:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {LOCATION_SUGGESTIONS.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setLocation(loc)}
                  className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
                    location === loc
                      ? 'bg-blue-900 text-white border-blue-900 font-semibold'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="complaint-description-input"
              className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1.5"
            >
              Detailed Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="complaint-description-input"
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide specific details about the issue (e.g. error lights, leak intensity, room numbers, frequency)..."
              className="block w-full p-3 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-900 focus:border-blue-900 bg-white placeholder:text-slate-400"
            />
          </div>

          {/* Optional Image Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1.5">
              Photo Evidence <span className="text-slate-400 font-normal">(Optional, max 5MB)</span>
            </label>

            {!imagePreview ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-900/60 transition-colors bg-slate-50/50"
              >
                <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-600 font-medium">
                  Drag and drop a photo here, or{' '}
                  <label
                    htmlFor="complaint-image-file"
                    className="text-blue-900 font-semibold cursor-pointer underline hover:text-blue-800"
                  >
                    browse files
                  </label>
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Supports JPG, PNG, WEBP up to 5MB
                </p>
                <input
                  id="complaint-image-file"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleImageChange(e.target.files[0]);
                    }
                  }}
                />
              </div>
            ) : (
              <div className="relative inline-block border border-slate-200 rounded-xl overflow-hidden bg-slate-100 shadow-2xs">
                <img
                  src={imagePreview}
                  alt="Complaint attachment preview"
                  className="w-48 h-36 object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-1.5 right-1.5 p-1 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 transition-colors"
                  aria-label="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <div className="p-1.5 text-[10px] text-slate-600 font-medium truncate max-w-48 text-center bg-white border-t border-slate-200">
                  {imageFile?.name || 'Attached Photo'}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="px-4 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              id="submit-complaint-btn"
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#1E3A8A] text-white text-xs sm:text-sm font-semibold hover:bg-blue-800 disabled:opacity-50 transition-colors shadow-xs"
            >
              {submitting ? (
                'Lodging Ticket...'
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Submit Complaint Ticket</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
