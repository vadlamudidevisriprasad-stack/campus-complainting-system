import {
  User,
  Complaint,
  Category,
  DashboardData,
  RegisteredStudent,
  ComplaintStatus,
} from '../types.ts';

const TOKEN_KEY = 'ccms_jwt_token';

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Do not set Content-Type if sending FormData (browser sets boundary)
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data?.error || data?.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data as T;
}

export const api = {
  // Auth
  login: (credentials: { email: string; password: string; role?: string }) =>
    request<{ token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  registerStudent: (formData: {
    name: string;
    email: string;
    password: string;
    department: string;
    year: string;
    rollNumber: string;
  }) =>
    request<{ token: string; user: User }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(formData),
    }),

  getMe: () => request<{ user: User }>('/api/auth/me'),

  updateProfile: (profile: Partial<User>) =>
    request<{ message: string; user: User }>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    }),

  // Complaints
  getDashboardStats: () => request<DashboardData>('/api/complaints/stats'),

  createComplaint: (formData: FormData) =>
    request<{ message: string; complaint: Complaint }>('/api/complaints', {
      method: 'POST',
      body: formData,
    }),

  getMyComplaints: (params?: { status?: string; category?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.status && params.status !== 'All') query.append('status', params.status);
    if (params?.category && params.category !== 'All') query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    const qs = query.toString();
    return request<{ complaints: Complaint[] }>(`/api/complaints/my${qs ? `?${qs}` : ''}`);
  },

  getAllComplaints: (params?: {
    status?: string;
    category?: string;
    search?: string;
    date?: string;
  }) => {
    const query = new URLSearchParams();
    if (params?.status && params.status !== 'All') query.append('status', params.status);
    if (params?.category && params.category !== 'All') query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    if (params?.date) query.append('date', params.date);
    const qs = query.toString();
    return request<{ complaints: Complaint[] }>(`/api/complaints/all${qs ? `?${qs}` : ''}`);
  },

  getComplaintById: (id: string) =>
    request<{ complaint: Complaint }>(`/api/complaints/${id}`),

  updateComplaintStatusAndRemark: (
    id: string,
    payload: { status?: ComplaintStatus; adminRemark?: string }
  ) =>
    request<{ message: string; complaint: Complaint }>(`/api/complaints/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  // Categories
  getCategories: () => request<{ categories: Category[] }>('/api/categories'),

  createCategory: (name: string) =>
    request<{ message: string; category: Category }>('/api/categories', {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),

  deleteCategory: (id: string) =>
    request<{ message: string }>(`/api/categories/${id}`, {
      method: 'DELETE',
    }),

  // Students (Admin only)
  getStudents: () => request<{ students: RegisteredStudent[] }>('/api/users/students'),
};
