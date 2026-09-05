import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { ShieldCheck, Lock, Mail, ArrowRight, ArrowLeft, KeyRound, AlertTriangle } from 'lucide-react';

interface AdminLoginProps {
  onSwitchToStudentLogin: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSwitchToStudentLogin }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email || !password) {
      setErrorMessage('Please enter both administrative email and password.');
      return;
    }

    try {
      setLoading(true);
      await login({ email, password, role: 'admin' });
    } catch (err: any) {
      setErrorMessage(err.message || 'Administrative login rejected.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    setEmail('admin@campus.edu');
    setPassword('admin123');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xl shadow-blue-500/20 ring-4 ring-blue-500/20">
            <ShieldCheck className="w-9 h-9" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Administrator Console
        </h2>
        <p className="mt-2 text-center text-xs sm:text-sm text-slate-400">
          Campus Complaint Management System & Facilities Administration
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-950 py-8 px-6 sm:px-10 shadow-2xl border border-slate-800 rounded-2xl">
          {/* Security Banner */}
          <div className="mb-5 p-3 rounded-lg bg-blue-950/70 border border-blue-800/80 flex items-start gap-2.5 text-blue-200 text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">Restricted Area:</span> Only authorized
              campus staff and maintenance supervisors may access this portal.
            </div>
          </div>

          {errorMessage && (
            <div
              id="admin-login-error"
              className="mb-5 p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-medium"
            >
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1"
              >
                Admin Email
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="admin-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@campus.edu"
                  className="block w-full pl-10 pr-3 py-2.5 text-sm border border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-900 text-white placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1"
              >
                Password
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-2.5 text-sm border border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-900 text-white placeholder:text-slate-500"
                />
              </div>
            </div>

            <button
              id="admin-login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                'Verifying Credentials...'
              ) : (
                <>
                  <span>Sign In to Admin Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-5 pt-4 border-t border-slate-800">
            <button
              id="admin-demo-fill-btn"
              type="button"
              onClick={handleDemoFill}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-blue-700/60 bg-blue-900/30 text-blue-200 text-xs font-semibold hover:bg-blue-900/50 transition-colors"
            >
              <KeyRound className="w-4 h-4 text-blue-400" />
              <span>Use Demo Admin Account (admin@campus.edu)</span>
            </button>
          </div>

          {/* Return to Student Portal */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
            <button
              id="back-to-student-portal-btn"
              type="button"
              onClick={onSwitchToStudentLogin}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Student Portal</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
