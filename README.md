# 📋 Task Management System

ระบบจัดการงานส่วนตัวแบบ Full-stack ที่พัฒนาด้วย React + Node.js + MongoDB

## 🌟 คุณสมบัติหลัก

### 1️⃣ ระบบผู้ใช้ (User Management)
- ✅ สมัครสมาชิก (Register)
- ✅ เข้าสู่ระบบ / ออกจากระบบ (Login / Logout)
- ✅ ผู้ใช้แต่ละคนเห็นงานของตัวเองเท่านั้น

### 2️⃣ จัดการงาน (Task Management)
- ✅ เพิ่มงาน (Create Task)
- ✅ แก้ไขงาน (Edit Task)
- ✅ ลบงาน (Delete Task)
- ✅ เปลี่ยนสถานะงาน:
  - To Do
  - In Progress
  - Done

### 3️⃣ หมวดหมู่ (Category)
- ✅ สร้างหมวดหมู่ (Work, Study, Personal)
- ✅ เลือกหมวดหมู่ตอนสร้างงาน
- ✅ กรองงานตามหมวดหมู่

### 4️⃣ กำหนดเวลา (Due Date)
- ✅ ตั้งวันที่ต้องเสร็จ
- ✅ แจ้งเตือนเมื่อใกล้ครบกำหนด / เกินกำหนด

### 5️⃣ แท็กผู้เกี่ยวข้อง (Tag / Assign)
- ✅ แท็กผู้ใช้คนอื่นในงาน (งานกลุ่ม / งานทีม)

### 6️⃣ ค้นหาและกรอง (Search / Filter)
- ✅ ค้นหาชื่องาน
- ✅ กรองตามสถานะ / หมวดหมู่ / วันที่

### 7️⃣ Dashboard 📊
- ✅ แสดงภาพรวม:
  - จำนวนงานทั้งหมด
  - งานที่ทำเสร็จ
  - งานที่กำลังทำ
  - งานที่เลยกำหนด
- ✅ แสดงในรูปแบบ Card สรุปและกราฟ

### 8️⃣ UI ที่ใช้ง่าย
- ✅ หน้า Task List
- ✅ หน้า Create Task
- ✅ หน้า Dashboard
- ✅ Dark / Light mode

## 🛠️ Tech Stack

### Frontend
- **React 19.2.0** - UI Framework
- **Vite 7.3.1** - Build Tool
- **Tailwind CSS** - Styling Framework
- **Chart.js** - กราฟสำหรับ Dashboard
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime Environment
- **Express 5.2.1** - Web Framework
- **MongoDB** - Database
- **Mongoose 9.2.4** - ODM
- **JWT** - Authentication
- **Socket.io** - Realtime updates (ถ้ามีเวลา)

## 📁 โครงสร้างโปรเจค

```
task-management/
├── backend/
│   ├── models/          # MongoDB Models
│   │   ├── User.js
│   │   ├── Task.js
│   │   └── Category.js
│   ├── routes/          # API Routes
│   │   ├── auth.js
│   │   ├── tasks.js
│   │   └── categories.js
│   ├── middleware/      # Express Middleware
│   │   └── auth.js
│   ├── controllers/     # Business Logic
│   └── index.js         # Server Entry Point
├── frontend/
│   ├── src/
│   │   ├── components/  # React Components
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── pages/       # Page Components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── TaskList.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── hooks/       # Custom Hooks
│   │   ├── utils/       # Utility Functions
│   │   └── App.jsx      # Main App
│   └── public/
└── README.md
```

## 🚀 การติดตั้งและรัน

### 1. Clone Repository
```bash
git clone <repository-url>
cd task-management
```

### 2. Backend Setup
```bash
cd backend
npm install
```

รัน Backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

รัน Frontend:
```bash
npm run dev
```

## 📱 หน้าเว็บแอปพลิเคชัน

1. **Login / Register** - หน้าล็อกอินและสมัครสมาชิก
2. **Dashboard** - หน้าแสดงภาพรวมงานและสถิติ
3. **Task List** - หน้ารายการงานทั้งหมด
4. **Create / Edit Task** - หน้าสร้างและแก้ไขงาน

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - สมัครสมาชิก
- `POST /api/auth/login` - เข้าสู่ระบบ
- `POST /api/auth/logout` - ออกจากระบบ

### Tasks
- `GET /api/tasks` - ดึงรายการงานทั้งหมด
- `POST /api/tasks` - สร้างงานใหม่
- `PUT /api/tasks/:id` - แก้ไขงาน
- `DELETE /api/tasks/:id` - ลบงาน

### Categories
- `GET /api/categories` - ดึงหมวดหมู่ทั้งหมด
- `POST /api/categories` - สร้างหมวดหมู่ใหม่

## 🌟 ฟีเจอร์พิเศษ (ถ้ามีเวลา)

- **Drag & Drop** - ลากวางงานเหมือน Trello
- **Realtime Updates** - อัพเดทแบบ Realtime ด้วย Socket.io
- **Notifications** - แจ้งเตือนเมื่อใกล้ครบกำหนด
- **Mobile Responsive** - รองรับมือถือ

## 📋 แผนการพัฒนา (2 วัน)

### Day 1
- ✅ Setup Project Structure
- ✅ Backend API (Authentication, Tasks, Categories)
- ✅ Frontend Components (Login, Register, Task List)
- ✅ Basic CRUD Operations

### Day 2
- ✅ Dashboard with Charts
- ✅ Search & Filter Functionality
- ✅ Dark/Light Mode
- ✅ UI/UX Improvements
- ✅ Testing & Bug Fixes

## 🤝 ผู้พัฒนา

พัฒนาโดย: Tanespol Praphasirisulee  
โปรเจค: Skill Test for Fullstack Developer Trainee

---

**Note**: โปรเจคนี้พัฒนาขึ้นเพื่อทดสอบทักษะ Fullstack Development ประกอบด้วย React, Node.js, Express และ MongoDB
