import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.ts';
import { Complaint, StudentNavPage } from '../../types.ts';
import { StatusBadge } from '../../components/StatusBadge.tsx';
import { Timeline } from '../../components/Timeline.tsx';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Tag,
  Clock,
  MessageSquare,
  Building,
  Image as ImageIcon,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

interface ComplaintDetailsProps {
  complaintId: string;
  onNavigate: (page: StudentNavPage) => void;
}

export const ComplaintDetails: React.FC<ComplaintDetailsProps> = ({
  complaintId,
  onNavigate,
}) => {
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.getComplaintById(complaintId);
      setComplaint(res.complaint);
    } catch (err: any) {
      setError(err.message || 'Unable to retrieve ticket details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [complaintId]);

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
        <span>Loading complaint record...</span>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="max-w-xl mx-auto p-8 bg-white rounded-2xl border border-rose-200 text-center">
        <AlertCircle className="w-10 h-10 text-rose-600 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-900">Complaint Not Found</h3>
        <p className="text-xs text-slate-600 mt-1">{error || 'This ticket could not be located.'}</p>
        <button
          onClick={() => onNavigate('my-complaints')}
          className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-900 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Complaints</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top back action & Header */}
      <div className="flex items-center justify-between">
        <button
          id="back-to-complaints-btn"
          onClick={() => onNavigate('my-complaints')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Complaints</span>
        </button>

        <button
          onClick={fetchDetails}
          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          title="Refresh status"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Main Ticket Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="font-mono text-sm font-bold text-blue-900 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200/70">
                {complaint.ticketNumber}
              </span>
              <StatusBadge status={complaint.status} size="md" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
              {complaint.title}
            </h1>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-500">
            <span className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              Submitted
            </span>
            <span className="font-medium text-slate-700">{formatDate(complaint.createdAt)}</span>
          </div>
        </div>

        {/* Status Lifecycle Timeline */}
        <div className="bg-slate-50/70 rounded-xl p-5 border border-slate-200/80">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            Resolution Progress
          </h3>
          <Timeline
            status={complaint.status}
            createdAt={complaint.createdAt}
            updatedAt={complaint.updatedAt}
          />
        </div>

        {/* Meta Grid (Category, Location, Submitter) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50/50 border border-slate-100 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-slate-400 text-[10px] uppercase font-semibold">
                Category
              </span>
              <span className="font-semibold text-slate-800">{complaint.category}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-slate-400 text-[10px] uppercase font-semibold">
                Campus Location
              </span>
              <span className="font-semibold text-slate-800">{complaint.location}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-slate-400 text-[10px] uppercase font-semibold">
                Student Account
              </span>
              <span className="font-semibold text-slate-800">{complaint.studentName}</span>
            </div>
          </div>
        </div>

        {/* Detailed Description */}
        <div>
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Description
          </h3>
          <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line bg-slate-50/40 p-4 rounded-xl border border-slate-100">
            {complaint.description}
          </p>
        </div>

        {/* Uploaded Image if available */}
        {complaint.image && (
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
              <span>Attached Photo Evidence</span>
            </h3>
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 inline-block max-w-lg">
              <img
                src={complaint.image}
                alt="Complaint attachment"
                className="max-h-96 w-auto object-contain"
              />
            </div>
          </div>
        )}

        {/* Admin Remark Box */}
        <div
          id="admin-remarks-section"
          className={`p-5 rounded-xl border ${
            complaint.adminRemark
              ? 'bg-blue-50/80 border-blue-200 text-blue-900'
              : 'bg-slate-50 border-slate-200 text-slate-500'
          }`}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <MessageSquare className="w-4 h-4 text-blue-700 shrink-0" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Administrator Remark & Action Plan
            </h4>
          </div>
          {complaint.adminRemark ? (
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium pl-6">
              “{complaint.adminRemark}”
            </p>
          ) : (
            <p className="text-xs text-slate-500 italic pl-6">
              No specific remarks added yet by facility coordinators. Check back as investigation
              advances.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
