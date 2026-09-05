import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { AdminNavPage } from '../types.ts';
import {
  LayoutDashboard,
  Inbox,
  Users,
  Tags,
  ShieldCheck,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  Building,
} from 'lucide-react';

interface AdminLayoutProps {
  currentPage: AdminNavPage;
  onNavigate: (page: AdminNavPage) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentPage,
  onNavigate,
  children,
}) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      id: 'dashboard' as AdminNavPage,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'all-complaints' as AdminNavPage,
      label: 'All Complaints',
      icon: Inbox,
    },
    {
      id: 'students' as AdminNavPage,
      label: 'Students',
      icon: Users,
    },
    {
      id: 'categories' as AdminNavPage,
      label: 'Categories',
      icon: Tags,
    },
    {
      id: 'profile' as AdminNavPage,
      label: 'Profile',
      icon: UserIcon,
    },
  ];

  const handleNavClick = (page: AdminNavPage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row text-slate-900 font-sans">
      {/* Mobile Header */}
      <header className="md:hidden bg-[#1E3A8A] text-white px-5 py-3.5 flex items-center justify-between shadow-md z-30 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-800 flex items-center justify-center font-bold text-white shadow-xs border border-blue-700/50">
            <ShieldCheck className="w-5 h-5 text-blue-100" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white">Campus CCMS</h1>
            <p className="text-[10px] text-blue-200 font-semibold uppercase tracking-widest">
              Admin Portal
            </p>
          </div>
        </div>
        <button
          id="admin-mobile-menu-toggle-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg text-blue-200 hover:text-white hover:bg-blue-800 transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Admin Sidebar */}
      <aside
        id="admin-sidebar"
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-[#1E3A8A] text-white flex flex-col justify-between shrink-0 transition-transform duration-200 ease-in-out md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="p-6 border-b border-blue-800/50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-800 flex items-center justify-center shadow-xs border border-blue-700/50">
            <Building className="w-6 h-6 text-blue-200" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xl font-bold tracking-tight text-white leading-none">
                CampusCare
              </h2>
            </div>
            <p className="text-xs text-blue-200 mt-1 uppercase tracking-widest">Admin Portal</p>
          </div>
        </div>

        {/* Admin Info Card */}
        <div className="p-4 mx-4 mt-4 rounded-xl bg-blue-900/60 border border-blue-700/50 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-800 border border-blue-400/30 text-white flex items-center justify-center text-xs font-bold">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AD'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">
                {user?.name || 'Administrator'}
              </p>
              <p className="text-[11px] text-blue-200 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                id={`admin-nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-blue-800 text-white font-medium shadow-xs'
                    : 'text-blue-100 hover:bg-blue-800/40 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-200'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-6 border-t border-blue-800/50">
          <button
            id="admin-logout-btn"
            onClick={logout}
            className="w-full flex items-center space-x-3 text-sm text-blue-100 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-4 h-4 text-blue-200" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile drawer */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/60 z-30 md:hidden backdrop-blur-xs"
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
        {/* Top bar for desktop */}
        <header className="hidden md:flex h-16 bg-white border-b border-slate-200 px-8 items-center justify-between sticky top-0 z-20 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-slate-700">
                Administration Console
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
                Staff Control
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Campus Facilities & Infrastructure Triage
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              id="admin-topbar-complaints-link"
              onClick={() => onNavigate('all-complaints')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1E3A8A] text-white text-xs font-semibold hover:bg-blue-800 transition-colors shadow-xs"
            >
              <Inbox className="w-4 h-4" />
              <span>Review Complaints</span>
            </button>
            <div
              className="w-9 h-9 rounded-full bg-blue-100 border-2 border-blue-500 flex items-center justify-center text-blue-700 font-bold text-xs"
              title={user?.name || 'Admin Profile'}
            >
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AD'}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-6">{children}</main>
      </div>
    </div>
  );
};
