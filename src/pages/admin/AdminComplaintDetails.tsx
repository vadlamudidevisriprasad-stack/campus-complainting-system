import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { Complaint, ComplaintStatus, AdminNavPage } from '../../types.ts';
import { StatusBadge } from '../../components/StatusBadge.tsx';
import { Timeline } from '../../components/Timeline.tsx';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Tag,
  User,
  GraduationCap,
  Hash,
  Clock,
  MessageSquare,
  Save,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

interface AdminComplaintDetailsProps {
  complaintId: string;
  onNavigate: (page: AdminNavPage) => void;
}

export const AdminComplaintDetails: React.FC<AdminComplaintDetailsProps> = ({
  complaintId,
  onNavigate,
}) => {
  const { showToast } = useAuth();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Editable fields by Admin
  const [status, setStatus] = useState<ComplaintStatus>('Pending');
  const [adminRemark, setAdminRemark] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.getComplaintById(complaintId);
      setComplaint(res.complaint);
      setStatus(res.complaint.status);
      setAdminRemark(res.complaint.adminRemark || '');
    } catch (err: any) {
      setError(err.message || 'Unable to retrieve complaint record.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [complaintId]);

  const handleSaveUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaint) return;

    try {
      setSaving(true);
      const res = await api.updateComplaintStatusAndRemark(complaint.id, {
        status,
        adminRemark: adminRemark.trim(),
      });
      setComplaint(res.complaint);
      showToast(
        'success',
        `Ticket ${res.complaint.ticketNumber} status updated to ${status}.`,
        'Update Saved'
      );
    } catch (err: any) {
      showToast('error', err.message || 'Failed to update complaint.', 'Save Error');
    } finally {
      setSaving(false);
    }
  };

  const handleQuickResolve = async () => {
    if (!complaint) return;
    setStatus('Resolved');
    try {
      setSaving(true);
      const remarkToSave =
        adminRemark.trim() || 'Issue investigated and resolved by campus maintenance.';
      const res = await api.updateComplaintStatusAndRemark(complaint.id, {
        status: 'Resolved',
        adminRemark: remarkToSave,
      });
      setComplaint(res.complaint);
      setAdminRemark(remarkToSave);
      showToast('success', `Complaint marked as Resolved!`, 'Ticket Resolved');
    } catch (err: any) {
      showToast('error', err.message || 'Failed to resolve ticket.', 'Error');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (isoStr: string) => {
    try {
      return new Date(isoStr).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return isoStr;
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-xs text-slate-400">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-slate-400" />
        <span>Loading ticket management console...</span>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="max-w-xl mx-auto p-8 bg-white rounded-2xl border border-rose-200 text-center">
        <AlertCircle className="w-10 h-10 text-rose-600 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-900">Complaint Not Found</h3>
        <p className="text-xs text-slate-600 mt-1">{error || 'This ticket could not be loaded.'}</p>
        <button
          onClick={() => onNavigate('all-complaints')}
          className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-900 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Complaints</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back button & quick action */}
      <div className="flex items-center justify-between">
        <button
          id="admin-back-to-complaints-btn"
          onClick={() => onNavigate('all-complaints')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Complaints</span>
        </button>

        <button
          onClick={fetchDetails}
          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          title="Refresh details"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Complaint Info, Student Info, Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-sm font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                  {complaint.ticketNumber}
                </span>
                <StatusBadge status={complaint.status} size="md" />
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Lodged: {formatDate(complaint.createdAt)}
              </span>
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-800">{complaint.title}</h1>
              <p className="text-sm text-slate-700 mt-3 p-4 rounded-xl bg-slate-50 border border-slate-100 leading-relaxed whitespace-pre-line">
                {complaint.description}
              </p>
            </div>

            {/* Timeline */}
            <div className="bg-slate-50/70 rounded-xl p-5 border border-slate-200/80">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                Lifecycle Progression
              </h3>
              <Timeline
                status={complaint.status}
                createdAt={complaint.createdAt}
                updatedAt={complaint.updatedAt}
              />
            </div>

            {/* Photo Attachment */}
            {complaint.image && (
              <div>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                  <span>Student Uploaded Photo</span>
                </h3>
                <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 inline-block max-w-md">
                  <img
                    src={complaint.image}
                    alt="Complaint photo"
                    className="max-h-80 w-auto object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Student Submitter Profile Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-[#1E3A8A]" />
              <span>Registered Student Information</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="block text-slate-400 text-[10px] uppercase font-semibold">
                  Student Name
                </span>
                <span className="font-bold text-slate-800 mt-0.5 block">
                  {complaint.studentName}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="block text-slate-400 text-[10px] uppercase font-semibold">
                  Roll Number
                </span>
                <span className="font-mono font-semibold text-[#1E3A8A] mt-0.5 block">
                  {complaint.studentRollNo || 'N/A'}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="block text-slate-400 text-[10px] uppercase font-semibold">
                  Department
                </span>
                <span className="font-medium text-slate-700 mt-0.5 block truncate">
                  {complaint.studentDept || 'General'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Administrative Triage Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#1E3A8A]" />
              <span>Administrative Action</span>
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Change complaint ticket status and attach official notes visible to the student.
            </p>

            <form onSubmit={handleSaveUpdate} className="space-y-4">
              {/* Status Selector */}
              <div>
                <label
                  htmlFor="admin-status-select"
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
                >
                  Update Status
                </label>
                <select
                  id="admin-status-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ComplaintStatus)}
                  className="w-full px-3 py-2 text-xs sm:text-sm font-semibold border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] bg-white"
                >
                  <option value="Pending">Pending (Orange)</option>
                  <option value="In Progress">In Progress (Blue)</option>
                  <option value="Resolved">Resolved (Green)</option>
                </select>
              </div>

              {/* Admin Remark */}
              <div>
                <label
                  htmlFor="admin-remark-textarea"
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
                >
                  Official Admin Remark
                </label>
                <textarea
                  id="admin-remark-textarea"
                  rows={4}
                  value={adminRemark}
                  onChange={(e) => setAdminRemark(e.target.value)}
                  placeholder="e.g. Technician has been assigned. Part replacement scheduled for Monday."
                  className="w-full p-3 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] bg-white placeholder:text-slate-400"
                />
              </div>

              {/* Save Button */}
              <button
                id="save-admin-update-btn"
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#1E3A8A] hover:bg-blue-800 text-white text-xs sm:text-sm font-semibold disabled:opacity-50 transition-colors shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving Update...' : 'Save Update'}</span>
              </button>

              {/* Quick Mark Resolved button if not already resolved */}
              {complaint.status !== 'Resolved' && (
                <button
                  id="quick-resolve-btn"
                  type="button"
                  onClick={handleQuickResolve}
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Mark as Resolved</span>
                </button>
              )}
            </form>
          </div>

          {/* Quick Meta Card */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs space-y-2.5 text-slate-600">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Category:</span>
              <span className="font-semibold text-slate-800">{complaint.category}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Location:</span>
              <span className="font-semibold text-slate-800">{complaint.location}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Last Modified:</span>
              <span className="font-mono text-slate-700">{formatDate(complaint.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
