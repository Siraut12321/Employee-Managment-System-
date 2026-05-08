# 🏢 Employee Management System

A full-stack **Admin Dashboard** for managing employees, departments, and salaries — built with the **MERN** stack (MongoDB, Express, React/Next.js, Node.js) and TypeScript.

---

## 🚀 Tech Stack

### 🖥️ Frontend
| Technology | Purpose |
|---|---|
| **Next.js 16** | React framework with App Router |
| **TypeScript** | Type safety |
| **Tailwind CSS v4** | Utility-first styling |
| **shadcn/ui** | Accessible UI components |
| **Zustand** | Global state management |
| **React Hook Form + Zod** | Form handling & validation |
| **Recharts** | Data visualization & charts |
| **Framer Motion** | Smooth animations |
| **Axios** | HTTP client |

### ⚙️ Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express 5** | REST API server |
| **TypeScript** | Type safety |
| **MongoDB + Mongoose** | Database & ODM |
| **JWT** | Authentication |
| **bcryptjs** | Password hashing |
| **Multer** | File/image uploads |

---

## ✨ Features

- 🔐 **Admin Authentication** — Secure JWT-based login with protected routes
- 👥 **Employee Management** — Add, edit, view, and delete employees with photo uploads
- 🏬 **Department Management** — Create and manage departments with employee counts
- 💰 **Salary Management** — Track, assign, and analyze employee salaries
- 📊 **Analytics Dashboard** — Visual charts for salary distribution and department stats
- 🌙 **Dark / Light Mode** — Theme toggle with `next-themes`
- 📱 **Responsive Design** — Mobile-friendly layout with sidebar navigation
- ⚡ **Real-time UI Updates** — Optimistic updates with Zustand stores

---

## 📁 Project Structure

```
├── backend/
│   └── src/
│       ├── config/         # Database connection
│       ├── controllers/    # Route handlers (auth, employee, department, salary)
│       ├── middleware/      # JWT auth middleware
│       ├── models/         # Mongoose models (Admin, Employee, Department, Salary)
│       ├── routes/         # Express routers
│       ├── utils/          # Seed script
│       └── server.ts       # Entry point
│
└── frontend/
    ├── app/                # Next.js App Router pages
    │   ├── dashboard/      # Protected dashboard routes
    │   └── login/          # Auth page
    ├── components/         # Reusable UI components
    ├── store/              # Zustand state stores
    ├── lib/api/            # Axios API service layer
    ├── hooks/              # Custom React hooks
    └── types/              # Shared TypeScript types
```

---

## 🛠️ Getting Started

### Prerequisites
- Node.js `v18+`
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

---

### 🔧 Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/employee-management
JWT_SECRET=your_jwt_secret_here
```

Seed the database with an admin account:

```bash
npm run seed
```

Start the development server:

```bash
npm run dev
```

> Backend runs on `http://localhost:5000`

---

### 🎨 Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the development server:

```bash
npm run dev
```

> Frontend runs on `http://localhost:3000`

---

## 🔑 Default Admin Credentials

After running the seed script:

```
Email:    admin@example.com
Password: admin123
```

> ⚠️ Change these credentials immediately after first login in production.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | Admin login |
| `GET` | `/api/employees` | Get all employees |
| `POST` | `/api/employees` | Create employee |
| `PUT` | `/api/employees/:id` | Update employee |
| `DELETE` | `/api/employees/:id` | Delete employee |
| `GET` | `/api/departments` | Get all departments |
| `POST` | `/api/departments` | Create department |
| `PUT` | `/api/departments/:id` | Update department |
| `DELETE` | `/api/departments/:id` | Delete department |
| `GET` | `/api/salary` | Get all salary records |
| `POST` | `/api/salary` | Assign salary |
| `PUT` | `/api/salary/:id` | Update salary |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**.

---

<div align="center">
  <p>Built with ❤️ using the MERN Stack</p>
</div>
