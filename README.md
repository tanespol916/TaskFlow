# 📋 Task Management System

ระบบจัดการงานส่วนตัวแบบ Full-stack ที่พัฒนาด้วย React + Node.js + MongoDB

## ️ Tech Stack

- **Frontend**: React 19.2.0, Vite 7.3.1, Tailwind CSS
- **Backend**: Node.js, Express 5.2.1, MongoDB, Mongoose 9.2.4
- **Authentication**: JWT

## 🚀 การติดตั้งและรัน

### 1. Clone Repository
```bash
git clone https://github.com/tanespol916/TaskFlow.git
cd TaskFlow
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🔧 Environment Variables

### Setup Environment Files
```bash
# Backend
cd backend
cp .env.example .env

# Frontend  
cd ../frontend
cp .env.example .env
```

## �� คุณสมบัติหลัก

- ✅ ระบบสมาชิก (Register/Login)
- ✅ จัดการงาน (Create/Edit/Delete)
- ✅ หมวดหมู่งานและการกรอง
- ✅ กำหนดวันที่ส่งงาน
- ✅ Dashboard พร้อมกราฟสรุป
- ✅ ค้นหาและกรองข้อมูล
- ✅ Dark/Light Mode

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - สมัครสมาชิก
- `POST /api/auth/login` - เข้าสู่ระบบ

### Tasks
- `GET /api/tasks` - ดึงรายการงาน
- `POST /api/tasks` - สร้างงานใหม่
- `PUT /api/tasks/:id` - แก้ไขงาน
- `DELETE /api/tasks/:id` - ลบงาน

### Categories
- `GET /api/categories` - ดึงหมวดหมู่
- `POST /api/categories` - สร้างหมวดหมู่

---

**GitHub**: https://github.com/tanespol916/TaskFlow.git  
**Live Demo**: https://lucid-perfection-production.up.railway.app


