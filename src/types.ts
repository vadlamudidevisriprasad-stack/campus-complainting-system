export type Role = 'student' | 'admin';

export type ComplaintStatus = 'Pending' | 'In Progress' | 'Resolved';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department?: string;
  year?: string;
  rollNumber?: string;
  createdAt: string;
}

export interface Complaint {
  id: string;
  ticketNumber: string;
  studentId: string;
  studentName: string;
  studentRollNo?: string;
  studentDept?: string;
  title: string;
  description: string;
  category: string;
  location: string;
  image?: string;
  status: ComplaintStatus;
  adminRemark?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  createdAt: string;
}

export interface DashboardStats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recentComplaints: Complaint[];
  categoryBreakdown?: Record<string, number>;
}

export interface RegisteredStudent extends User {
  complaintCount: number;
  pendingCount: number;
  resolvedCount: number;
}

export type StudentNavPage =
  | 'dashboard'
  | 'raise-complaint'
  | 'my-complaints'
  | 'complaint-details'
  | 'profile';

export type AdminNavPage =
  | 'dashboard'
  | 'all-complaints'
  | 'complaint-details'
  | 'students'
  | 'categories'
  | 'profile';
