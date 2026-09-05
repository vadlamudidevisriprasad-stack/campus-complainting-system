import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string; // hashed
  role: 'student' | 'admin';
  department?: string;
  year?: string;
  rollNumber?: string;
  createdAt: string;
}

export interface IComplaint {
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
  status: 'Pending' | 'In Progress' | 'Resolved';
  adminRemark?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICategory {
  id: string;
  name: string;
  createdAt: string;
}

interface DatabaseSchema {
  users: IUser[];
  complaints: IComplaint[];
  categories: ICategory[];
  ticketCounter: number;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

const DEFAULT_CATEGORIES = [
  'Classroom',
  'Laboratory',
  'Wi-Fi / Internet',
  'Hostel',
  'Transport',
  'Library',
  'Maintenance',
  'Electrical',
  'Water / Plumbing',
  'Other',
];

class JsonDatabase {
  private data: DatabaseSchema = {
    users: [],
    complaints: [],
    categories: [],
    ticketCounter: 1000,
  };

  constructor() {
    this.init();
  }

  private init() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } catch (err) {
        console.error('Error reading existing database file, re-initializing', err);
        this.seedInitialData();
      }
    } else {
      this.seedInitialData();
    }
  }

  private seedInitialData() {
    const salt = bcrypt.genSaltSync(10);
    const adminPassword = bcrypt.hashSync('admin123', salt);
    const studentPassword = bcrypt.hashSync('student123', salt);

    const adminUser: IUser = {
      id: 'usr-admin-01',
      name: 'Campus Administrator',
      email: 'admin@campus.edu',
      password: adminPassword,
      role: 'admin',
      department: 'Campus Administration',
      createdAt: new Date().toISOString(),
    };

    const studentUser: IUser = {
      id: 'usr-student-01',
      name: 'Alex Morgan',
      email: 'alex.student@campus.edu',
      password: studentPassword,
      role: 'student',
      department: 'Computer Science & Engineering',
      year: '3rd Year',
      rollNumber: 'CS2023-042',
      createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    };

    const categories: ICategory[] = DEFAULT_CATEGORIES.map((cat, idx) => ({
      id: `cat-${idx + 1}`,
      name: cat,
      createdAt: new Date().toISOString(),
    }));

    const sampleComplaints: IComplaint[] = [
      {
        id: 'cmp-001',
        ticketNumber: 'CMP-1001',
        studentId: studentUser.id,
        studentName: studentUser.name,
        studentRollNo: studentUser.rollNumber,
        studentDept: studentUser.department,
        title: 'Wi-Fi Access Point Unstable in 3rd Floor Lab',
        description: 'The router near CSE Lab 3 keeps dropping connections during practical sessions, affecting lab tests.',
        category: 'Wi-Fi / Internet',
        location: 'CSE Block',
        status: 'In Progress',
        adminRemark: 'Network engineering team has dispatched a replacement switch and firmware reset is scheduled.',
        createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      },
      {
        id: 'cmp-002',
        ticketNumber: 'CMP-1002',
        studentId: studentUser.id,
        studentName: studentUser.name,
        studentRollNo: studentUser.rollNumber,
        studentDept: studentUser.department,
        title: 'Overhead Ceiling Fan Noise in Room 204',
        description: 'Ceiling fan #2 is vibrating aggressively and making a loud rattling sound during lectures.',
        category: 'Electrical',
        location: 'Main Block',
        status: 'Resolved',
        adminRemark: 'Electrician lubricated bearings and tightened the mounting bracket on Friday.',
        createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      },
      {
        id: 'cmp-003',
        ticketNumber: 'CMP-1003',
        studentId: studentUser.id,
        studentName: studentUser.name,
        studentRollNo: studentUser.rollNumber,
        studentDept: studentUser.department,
        title: 'Water Cooler Tap Leakage on Ground Floor',
        description: 'The right-side dispensing nozzle does not shut off completely, leading to puddling on the floor.',
        category: 'Water / Plumbing',
        location: 'Library',
        status: 'Pending',
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      },
    ];

    this.data = {
      users: [adminUser, studentUser],
      complaints: sampleComplaints,
      categories,
      ticketCounter: 1003,
    };

    this.persist();
  }

  private persist() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file', err);
    }
  }

  // Users
  getUsers(): IUser[] {
    return this.data.users;
  }

  getUserById(id: string): IUser | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  getUserByEmail(email: string): IUser | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(user: Omit<IUser, 'id' | 'createdAt'>): IUser {
    const newUser: IUser = {
      ...user,
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    this.data.users.push(newUser);
    this.persist();
    return newUser;
  }

  updateUser(id: string, updates: Partial<Omit<IUser, 'id' | 'role' | 'password'>>): IUser | null {
    const idx = this.data.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    this.data.users[idx] = {
      ...this.data.users[idx],
      ...updates,
    };
    this.persist();
    return this.data.users[idx];
  }

  // Categories
  getCategories(): ICategory[] {
    return this.data.categories;
  }

  createCategory(name: string): ICategory {
    const newCat: ICategory = {
      id: `cat-${Date.now()}`,
      name: name.trim(),
      createdAt: new Date().toISOString(),
    };
    this.data.categories.push(newCat);
    this.persist();
    return newCat;
  }

  deleteCategory(id: string): boolean {
    const initialLen = this.data.categories.length;
    this.data.categories = this.data.categories.filter((c) => c.id !== id);
    if (this.data.categories.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // Complaints
  getComplaints(): IComplaint[] {
    return this.data.complaints;
  }

  getComplaintById(id: string): IComplaint | undefined {
    return this.data.complaints.find((c) => c.id === id || c.ticketNumber === id);
  }

  getComplaintsByStudent(studentId: string): IComplaint[] {
    return this.data.complaints.filter((c) => c.studentId === studentId);
  }

  createComplaint(data: {
    studentId: string;
    studentName: string;
    studentRollNo?: string;
    studentDept?: string;
    title: string;
    description: string;
    category: string;
    location: string;
    image?: string;
  }): IComplaint {
    this.data.ticketCounter += 1;
    const ticketNumber = `CMP-${this.data.ticketCounter}`;
    const now = new Date().toISOString();

    const complaint: IComplaint = {
      id: `cmp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      ticketNumber,
      studentId: data.studentId,
      studentName: data.studentName,
      studentRollNo: data.studentRollNo,
      studentDept: data.studentDept,
      title: data.title.trim(),
      description: data.description.trim(),
      category: data.category,
      location: data.location,
      image: data.image,
      status: 'Pending',
      createdAt: now,
      updatedAt: now,
    };

    this.data.complaints.unshift(complaint);
    this.persist();
    return complaint;
  }

  updateComplaint(
    id: string,
    updates: {
      status?: 'Pending' | 'In Progress' | 'Resolved';
      adminRemark?: string;
    }
  ): IComplaint | null {
    const idx = this.data.complaints.findIndex((c) => c.id === id || c.ticketNumber === id);
    if (idx === -1) return null;

    const current = this.data.complaints[idx];
    const updated: IComplaint = {
      ...current,
      status: updates.status || current.status,
      adminRemark: updates.adminRemark !== undefined ? updates.adminRemark : current.adminRemark,
      updatedAt: new Date().toISOString(),
    };

    this.data.complaints[idx] = updated;
    this.persist();
    return updated;
  }
}

export const db = new JsonDatabase();
