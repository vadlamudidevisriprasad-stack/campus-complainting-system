# Campus Complaint Management System (CCMS)

A complete full-stack web application designed for collegiate campuses. CCMS enables students to lodge facility and infrastructure complaints and allows campus administrators to triage, assign, update, and resolve those complaints in real-time.

---

## 🌟 Key Features

### 👨‍🎓 Student Portal
- **Registration & Profile**: Full Name, College Email, Password, Department, Academic Year, and Roll Number.
- **Secure Student Login**: Authenticated via JWT tokens.
- **Student Dashboard**:
  - Metric counters for **Total**, **Pending**, **In Progress**, and **Resolved** complaints.
  - Recent complaints list with immediate status indicators.
  - Quick action to lodge new complaints.
- **Raise Complaint**:
  - Title, Category, Location (with quick suggestions: *Main Block, CSE Block, ECE Block, Mechanical Block, Library, Hostel, Cafeteria, Parking, College Bus*), and detailed description.
  - Optional image/photo evidence upload (Multer file handling with instant preview).
  - Automatically generates unique tickets (e.g. `CMP-1001`, `CMP-1002`).
  - Default initial status: **Pending**.
- **My Complaints Page**:
  - Tab filters for **All**, **Pending**, **In Progress**, and **Resolved**.
  - Color-coded badges: **Pending** (*Orange*), **In Progress** (*Blue*), **Resolved** (*Green*).
  - Search bar by title, ticket ID, and location.
- **Complaint Details & Status Timeline**:
  - Detailed incident report, location, category, student details, and photo attachment.
  - Visual 4-stage lifecycle timeline:
    $$\text{Complaint Submitted} \longrightarrow \text{Pending Review} \longrightarrow \text{In Progress} \longrightarrow \text{Resolved}$$
  - Dedicated Administrator Remarks & Action Plan box.

---

### 🛡️ Admin Portal
- **Separate Dedicated Admin Login**: Secure entry point for facility coordinators.
- **Role-Based Access Enforcement**: Students are strictly forbidden from accessing administrative endpoints and dashboard screens.
- **Admin Dashboard**:
  - Campus-wide complaint statistics (**Total**, **Pending**, **In Progress**, **Resolved**).
  - Facility category distribution breakdown.
  - Incoming student complaints queue.
- **All Complaints Management**:
  - Comprehensive table with search by Student Name, Ticket ID, and Complaint Title.
  - Multi-filtering by Status, Category, and Submission Date.
- **Complaint Triage & Resolution**:
  - Open any student complaint.
  - Update status (`Pending`, `In Progress`, `Resolved`).
  - Add official administrative remarks (e.g. *"Technician has been assigned. Replacement fan arriving Friday."*).
  - 1-click **Mark as Resolved** shortcut.
- **Student Directory**:
  - Registry of all registered students with roll numbers, departments, years, and total complaints filed.
- **Category Management**:
  - Manage facility taxonomy (Add new categories or delete existing ones).
  - Default categories: *Classroom, Laboratory, Wi-Fi / Internet, Hostel, Transport, Library, Maintenance, Electrical, Water / Plumbing, Other*.

---

## 🔑 Pre-configured Accounts for Testing

| Role | Email | Password | Details |
|---|---|---|---|
| **Campus Admin** | `admin@campus.edu` | `admin123` | Full administrative & triage access |
| **Student** | `alex.student@campus.edu` | `student123` | Alex Morgan (CSE, 3rd Year, Roll: CS2023-042) |

> **Note**: Both login portals also feature a 1-click **Demo Account** button to prefill these credentials instantly.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React icons
- **Backend**: Node.js, Express.js
- **Authentication**: JSON Web Tokens (JWT) & bcrypt password hashing
- **File Uploads**: Multer middleware (supports JPG, PNG, WEBP, GIF with 5MB cap)
- **Database**: Dual-mode storage:
  - Zero-config auto-persisting embedded JSON database in `./data/database.json`.
  - MongoDB integration support via `MONGODB_URI`.

---

## 🚀 Installation & Running

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

`.env` configuration options:
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secure-jwt-secret-key-2026
MONGODB_URI=mongodb://localhost:27017/campus_complaints
```

### 4. Run Development Server
```bash
npm run dev
```
The server will start at `http://localhost:3000` with both Express API backend routes and Vite hot-reloading frontend.

### 5. Production Build
```bash
npm run build
npm start
```

---

## 🍃 MongoDB Setup Instructions (Optional)

1. Install MongoDB Community Edition or sign up for a free cloud cluster at [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Start your local MongoDB service:
   ```bash
   mongod --dbpath /path/to/data/db
   ```
3. Set your connection string in `.env`:
   ```env
   MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/campus_complaints"
   ```
4. If no `MONGODB_URI` is provided, the application runs automatically using the built-in persistent disk store in `./data/database.json`, ensuring zero-setup execution.

---

## 🔒 Role-Based Security: Student vs. Admin

1. **Backend Protection**:
   - Administrative endpoints (`/api/complaints/all`, `/api/complaints/:id/status`, `/api/categories`, `/api/users/students`) are guarded with the `requireAdmin` middleware.
   - If a student token attempts to query admin endpoints, the server rejects the request with HTTP `403 Forbidden` (`"Access denied: Students are strictly forbidden from accessing admin resources."`).
2. **Frontend Route Guards**:
   - Attempting to navigate to admin views or append `#admin` while logged in as a student triggers an automatic redirection and error notification.
3. **Separate Portals**:
   - Distinct, dedicated login pages for Students and Campus Officials.
