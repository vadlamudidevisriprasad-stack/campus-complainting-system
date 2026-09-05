import React, { useEffect, useState } from 'react';
import { api } from '../../services/api.ts';
import { Complaint, DashboardStats, AdminNavPage } from '../../types.ts';
import { StatusBadge } from '../../components/StatusBadge.tsx';
import {
  Inbox,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  MapPin,
  Tag,
  User,
  RefreshCw,
  TrendingUp,
  BarChart3,
  Layers,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (page: AdminNavPage, complaintId?: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });
  const [recentComplaints, setRecentComplaints] = useState<Complaint[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const data = await api.getDashboardStats();
      setStats(data.stats);
      setRecentComplaints(data.recentComplaints || []);
      setCategoryBreakdown(data.categoryBreakdown || {});
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-100">
              Administrative Control Center
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800 mt-1.5">
            Campus Complaints Overview
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Real-time monitoring of collegiate facility requests, maintenance assignments, and
            resolution status across all campus sectors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="admin-refresh-stats-btn"
            onClick={fetchAdminData}
            title="Refresh statistics"
            className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            id="admin-triage-complaints-btn"
            onClick={() => onNavigate('all-complaints')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1E3A8A] hover:bg-blue-800 text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs"
          >
            <Inbox className="w-4 h-4" />
            <span>Review Complaints</span>
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
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-3xl font-bold text-slate-800">{stats.total}</span>
            <p className="mt-2 text-[10px] text-slate-400">Campus-wide requests</p>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs border-l-4 border-l-orange-500 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">
              Pending Triage
            </span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-3xl font-bold text-slate-800">{stats.pending}</span>
            <p className="mt-2 text-[10px] text-slate-400">Awaiting staff assignment</p>
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
            <p className="mt-2 text-[10px] text-slate-400">Technicians dispatched</p>
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

      {/* Grid: Category Breakdown + Recent Complaints */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown (1 col) */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-700">Complaints by Category</h3>
                <p className="text-xs text-slate-400 mt-0.5">Distribution across campus facilities</p>
              </div>
              <BarChart3 className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-3">
              {Object.entries(categoryBreakdown).length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No categories found.</p>
              ) : (
                Object.entries(categoryBreakdown).map(([catName, count]) => {
                  const countNum = Number(count) || 0;
                  const percentage = stats.total > 0 ? Math.round((countNum / stats.total) * 100) : 0;
                  return (
                    <div key={catName} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-700 truncate">{catName}</span>
                        <span className="font-bold text-slate-900 ml-2 font-mono">
                          {countNum}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-[#1E3A8A] h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100">
            <button
              onClick={() => onNavigate('categories')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 transition-colors"
            >
              <span>Manage Campus Categories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Recent Complaints (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="font-bold text-slate-700">Recent Student Complaints</h3>
                <p className="text-xs text-slate-400 mt-0.5">Incoming tickets requiring evaluation</p>
              </div>
              <button
                id="admin-view-all-recent-btn"
                onClick={() => onNavigate('all-complaints')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 transition-colors"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {loading ? (
              <div className="p-12 text-center text-xs text-slate-400">Loading complaints...</div>
            ) : recentComplaints.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-400">
                No complaints recorded in database.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentComplaints.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 sm:px-6 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          {item.ticketNumber}
                        </span>
                        <StatusBadge status={item.status} size="sm" />
                        <span className="text-[11px] text-slate-400 font-mono">
                          {formatDate(item.createdAt)}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-800 truncate">
                        {item.title}
                      </h4>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1 font-medium text-slate-700">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.studentName}</span>
                        </span>
                        <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-0.5 rounded text-xs text-slate-700">
                          <Tag className="w-3 h-3 text-slate-400" />
                          <span>{item.category}</span>
                        </span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.location}</span>
                        </span>
                      </div>
                    </div>

                    <button
                      id={`admin-open-${item.ticketNumber}`}
                      onClick={() => onNavigate('complaint-details', item.id)}
                      className="shrink-0 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-blue-600 hover:text-blue-800 hover:bg-slate-50 transition-colors inline-flex items-center gap-1"
                    >
                      <span>Manage</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
