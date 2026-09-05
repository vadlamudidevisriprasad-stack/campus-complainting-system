import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { Building2, Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

interface StudentLoginProps {
  onSwitchToRegister: () => void;
  onSwitchToAdminLogin: () => void;
}

export const StudentLogin: React.FC<StudentLoginProps> = ({
  onSwitchToRegister,
  onSwitchToAdminLogin,
}) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email || !password) {
      setErrorMessage('Please fill in both email and password.');
      return;
    }

    try {
      setLoading(true);
      await login({ email, password, role: 'student' });
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    setEmail('alex.student@campus.edu');
    setPassword('student123');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Header Icon & Title */}
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-xl bg-[#1E3A8A] text-white flex items-center justify-center shadow-xs">
            <Building2 className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl sm:text-3xl font-bold tracking-tight text-slate-800">
          Campus Complaint Management System
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          Student Portal — Log in to lodge and track campus facility complaints
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xs border border-slate-200 rounded-xl">
          {errorMessage && (
            <div
              id="student-login-error"
              className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium"
            >
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="student-email"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"
              >
                College Email
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="student-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@campus.edu"
                  className="block w-full pl-10 pr-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] bg-white placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="student-password"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"
              >
                Password
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="student-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] bg-white placeholder:text-slate-400"
                />
              </div>
            </div>

            <button
              id="student-login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-xs text-sm font-semibold text-white bg-[#1E3A8A] hover:bg-blue-800 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-[#1E3A8A] disabled:opacity-50 transition-colors"
            >
              {loading ? (
                'Logging in...'
              ) : (
                <>
                  <span>Sign In as Student</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Button */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <button
              id="student-demo-fill-btn"
              type="button"
              onClick={handleDemoFill}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-blue-200 bg-blue-50/70 text-[#1E3A8A] text-xs font-semibold hover:bg-blue-100/70 transition-colors"
            >
              <UserCheck className="w-4 h-4 text-[#1E3A8A]" />
              <span>Use Demo Student Account (Alex Morgan)</span>
            </button>
          </div>

          {/* Register Link */}
          <div className="mt-4 text-center">
            <p className="text-xs text-slate-600">
              New student?{' '}
              <button
                id="goto-register-btn"
                type="button"
                onClick={onSwitchToRegister}
                className="font-semibold text-[#1E3A8A] hover:text-blue-700 underline underline-offset-2"
              >
                Create an account
              </button>
            </p>
          </div>

          {/* Admin Portal Switch */}
          <div className="mt-6 pt-4 border-t border-slate-200 text-center">
            <button
              id="goto-admin-login-btn"
              type="button"
              onClick={onSwitchToAdminLogin}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              <span>Campus Official / Admin Login</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
