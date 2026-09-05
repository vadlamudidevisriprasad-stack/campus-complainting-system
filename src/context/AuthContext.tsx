import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Role } from '../types.ts';
import { api, getToken, setToken, clearToken } from '../services/api.ts';
import { ToastMessage, NotificationToast } from '../components/NotificationToast.tsx';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAdmin: boolean;
  isStudent: boolean;
  login: (credentials: { email: string; password: string; role?: Role }) => Promise<User>;
  registerStudent: (formData: {
    name: string;
    email: string;
    password: string;
    department: string;
    year: string;
    rollNumber: string;
  }) => Promise<User>;
  logout: () => void;
  updateProfile: (profile: Partial<User>) => Promise<User>;
  showToast: (type: 'success' | 'error' | 'info', message: string, title?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(getToken());
  const [loading, setLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback(
    (type: 'success' | 'error' | 'info', message: string, title?: string) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      setToasts((prev) => [...prev, { id, type, message, title }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch current user on mount if token exists
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = getToken();
      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        const data = await api.getMe();
        setUser(data.user);
      } catch (err) {
        console.warn('Session expired or invalid:', err);
        clearToken();
        setTokenState(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: {
    email: string;
    password: string;
    role?: Role;
  }): Promise<User> => {
    try {
      const response = await api.login(credentials);
      setToken(response.token);
      setTokenState(response.token);
      setUser(response.user);
      showToast('success', `Welcome back, ${response.user.name}!`, 'Login Successful');
      return response.user;
    } catch (err: any) {
      const msg = err.message || 'Login failed. Please check your credentials.';
      showToast('error', msg, 'Authentication Failed');
      throw err;
    }
  };

  const registerStudent = async (formData: {
    name: string;
    email: string;
    password: string;
    department: string;
    year: string;
    rollNumber: string;
  }): Promise<User> => {
    try {
      const response = await api.registerStudent(formData);
      setToken(response.token);
      setTokenState(response.token);
      setUser(response.user);
      showToast(
        'success',
        'Your student account has been registered successfully.',
        'Registration Complete'
      );
      return response.user;
    } catch (err: any) {
      const msg = err.message || 'Registration failed. Please review your details.';
      showToast('error', msg, 'Registration Error');
      throw err;
    }
  };

  const logout = () => {
    clearToken();
    setTokenState(null);
    setUser(null);
    showToast('info', 'You have been logged out securely.', 'Signed Out');
  };

  const updateProfile = async (profile: Partial<User>): Promise<User> => {
    try {
      const response = await api.updateProfile(profile);
      setUser(response.user);
      showToast('success', 'Your profile details have been saved.', 'Profile Updated');
      return response.user;
    } catch (err: any) {
      const msg = err.message || 'Failed to update profile.';
      showToast('error', msg, 'Update Error');
      throw err;
    }
  };

  const isAdmin = user?.role === 'admin';
  const isStudent = user?.role === 'student';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin,
        isStudent,
        login,
        registerStudent,
        logout,
        updateProfile,
        showToast,
      }}
    >
      {children}
      <NotificationToast toasts={toasts} onDismiss={dismissToast} />
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
