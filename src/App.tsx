import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { StudentNavPage, AdminNavPage } from './types.ts';

// Auth Pages
import { StudentLogin } from './pages/auth/StudentLogin.tsx';
import { StudentRegister } from './pages/auth/StudentRegister.tsx';
import { AdminLogin } from './pages/auth/AdminLogin.tsx';

// Layouts
import { StudentLayout } from './layouts/StudentLayout.tsx';
import { AdminLayout } from './layouts/AdminLayout.tsx';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard.tsx';
import { RaiseComplaint } from './pages/student/RaiseComplaint.tsx';
import { MyComplaints } from './pages/student/MyComplaints.tsx';
import { ComplaintDetails } from './pages/student/ComplaintDetails.tsx';
import { StudentProfile } from './pages/student/StudentProfile.tsx';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard.tsx';
import { AllComplaints } from './pages/admin/AllComplaints.tsx';
import { AdminComplaintDetails } from './pages/admin/AdminComplaintDetails.tsx';
import { StudentsList } from './pages/admin/StudentsList.tsx';
import { CategoriesManage } from './pages/admin/CategoriesManage.tsx';
import { AdminProfile } from './pages/admin/AdminProfile.tsx';

import { Building2, ShieldAlert } from 'lucide-react';

type AuthView = 'student-login' | 'student-register' | 'admin-login';

function MainApp() {
  const { user, loading, isAdmin, isStudent, showToast } = useAuth();

  const [authView, setAuthView] = useState<AuthView>('student-login');
  const [studentPage, setStudentPage] = useState<StudentNavPage>('dashboard');
  const [adminPage, setAdminPage] = useState<AdminNavPage>('dashboard');
  const [selectedComplaintId, setSelectedComplaintId] = useState<string>('');

  // Handle URL hash navigation if user manipulates URL or deep links
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('admin')) {
        // Enforce: student should not access admin pages!
        if (user && user.role === 'student') {
          showToast(
            'error',
            'A student should not access admin pages. Access restricted.',
            'Unauthorized'
          );
          window.location.hash = '';
          return;
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [user, showToast]);

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center animate-pulse mb-4">
          <Building2 className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-lg font-bold tracking-tight">Campus Complaint Management System</h2>
        <p className="text-xs text-slate-400 mt-1">Connecting to facility servers...</p>
      </div>
    );
  }

  // Unauthenticated Views
  if (!user) {
    if (authView === 'student-register') {
      return <StudentRegister onSwitchToLogin={() => setAuthView('student-login')} />;
    }
    if (authView === 'admin-login') {
      return <AdminLogin onSwitchToStudentLogin={() => setAuthView('student-login')} />;
    }
    return (
      <StudentLogin
        onSwitchToRegister={() => setAuthView('student-register')}
        onSwitchToAdminLogin={() => setAuthView('admin-login')}
      />
    );
  }

  // Student Views
  if (isStudent) {
    const handleStudentNavigate = (page: StudentNavPage, complaintId?: string) => {
      if (complaintId) {
        setSelectedComplaintId(complaintId);
      }
      setStudentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
      <StudentLayout currentPage={studentPage} onNavigate={handleStudentNavigate}>
        {studentPage === 'dashboard' && <StudentDashboard onNavigate={handleStudentNavigate} />}
        {studentPage === 'raise-complaint' && (
          <RaiseComplaint onNavigate={handleStudentNavigate} />
        )}
        {studentPage === 'my-complaints' && <MyComplaints onNavigate={handleStudentNavigate} />}
        {studentPage === 'complaint-details' && (
          <ComplaintDetails
            complaintId={selectedComplaintId}
            onNavigate={handleStudentNavigate}
          />
        )}
        {studentPage === 'profile' && <StudentProfile />}
      </StudentLayout>
    );
  }

  // Admin Views
  if (isAdmin) {
    const handleAdminNavigate = (page: AdminNavPage, complaintId?: string) => {
      if (complaintId) {
        setSelectedComplaintId(complaintId);
      }
      setAdminPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
      <AdminLayout currentPage={adminPage} onNavigate={handleAdminNavigate}>
        {adminPage === 'dashboard' && <AdminDashboard onNavigate={handleAdminNavigate} />}
        {adminPage === 'all-complaints' && <AllComplaints onNavigate={handleAdminNavigate} />}
        {adminPage === 'complaint-details' && (
          <AdminComplaintDetails
            complaintId={selectedComplaintId}
            onNavigate={handleAdminNavigate}
          />
        )}
        {adminPage === 'students' && <StudentsList onNavigate={handleAdminNavigate} />}
        {adminPage === 'categories' && <CategoriesManage onNavigate={handleAdminNavigate} />}
        {adminPage === 'profile' && <AdminProfile />}
      </AdminLayout>
    );
  }

  // Fallback if role is unrecognized
  return (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <div className="max-w-md p-8 bg-white rounded-2xl border border-rose-200">
        <ShieldAlert className="w-12 h-12 text-rose-600 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-900">Unrecognized User Role</h3>
        <p className="text-xs text-slate-600 mt-2">
          Your account does not have student or administrator permissions configured.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
