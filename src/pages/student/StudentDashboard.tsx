import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { Complaint, DashboardStats, StudentNavPage } from '../../types.ts';
import { StatusBadge } from '../../components/StatusBadge.tsx';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  ArrowRight,
  MapPin,
  Tag,
  RefreshCw,
} from 'lucide-react';

interface StudentDashboardProps {
  onNavigate: (page: StudentNavPage, complaintId?: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });
  const [recentComplaints, setRecentComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await api.getDashboardStats();
      setStats(data.stats);
      setRecentComplaints(data.recentComplaints || []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner & Quick Action */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
              Campus Facilities Support
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mt-1.5 tracking-tight">
            Welcome, {user?.name || 'Student'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Track your campus facility issues, raise new maintenance requests, and monitor
            administrative resolution timelines in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            id="student-dash-refresh-btn"
            onClick={fetchDashboardData}
            title="Refresh dashboard"
            className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            id="student-dash-raise-btn"
            onClick={() => onNavigate('raise-complaint')}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#1E3A8A] text-white text-xs sm:text-sm font-semibold hover:bg-blue-800 transition-colors shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Raise Complaint</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 shrink-0">
        {/* Total Complaints */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Total Complaints
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-3xl font-bold text-slate-800">{stats.total}</span>
            <p className="mt-2 text-[10px] text-slate-400">Submitted by you</p>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs border-l-4 border-l-orange-500 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">
              Pending Review
            </span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-3xl font-bold text-slate-800">{stats.pending}</span>
            <p className="mt-2 text-[10px] text-slate-400">Awaiting triage</p>
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs border-l-4 border-l-blue-500 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              In Progress
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-3xl font-bold text-slate-800">{stats.inProgress}</span>
            <p className="mt-2 text-[10px] text-slate-400">Under investigation</p>
          </div>
        </div>

        {/* Resolved */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs border-l-4 border-l-emerald-500 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
              Resolved
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-3xl font-bold text-slate-800">{stats.resolved}</span>
            <p className="mt-2 text-[10px] text-slate-400">Successfully closed</p>
          </div>
        </div>
      </div>

      {/* Recent Complaints Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-700">Recent Complaints</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Latest activity on facility tickets raised under your account
            </p>
          </div>
          <button
            id="student-dash-view-all-btn"
            onClick={() => onNavigate('my-complaints')}
            className="text-blue-600 hover:text-blue-800 font-bold text-xs sm:text-sm inline-flex items-center gap-1.5 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            Loading recent complaints...
          </div>
        ) : recentComplaints.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-slate-800">No complaints lodged yet</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              If you notice broken facilities, Wi-Fi outages, or plumbing leaks anywhere on
              campus, raise a complaint to notify maintenance.
            </p>
            <button
              onClick={() => onNavigate('raise-complaint')}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1E3A8A] text-white text-xs font-semibold hover:bg-blue-800 transition-colors shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Raise First Complaint</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentComplaints.map((item) => (
              <div
                key={item.id}
                id={`recent-complaint-${item.ticketNumber}`}
                className="p-4 sm:px-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {item.ticketNumber}
                    </span>
                    <StatusBadge status={item.status} size="sm" />
                    <span className="text-[11px] text-slate-400 font-mono">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-slate-800 truncate">{item.title}</h4>

                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-xs text-slate-700">
                      <Tag className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.category}</span>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.location}</span>
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <button
                    id={`view-detail-${item.ticketNumber}`}
                    onClick={() => onNavigate('complaint-details', item.id)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-blue-600 hover:text-blue-800 hover:bg-slate-50 transition-colors"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
