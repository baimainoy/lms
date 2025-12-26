# Product Requirements Document (PRD)
# LMS - Learning Management System

## Project Overview
ระบบจัดการการเรียนรู้ออนไลน์ (LMS) สำหรับขายและจัดการคอร์สเรียนออนไลน์ รองรับการชำระเงินผ่านการโอนเงินและอัพโหลดสลิป

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14+ (App Router) + TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | NextAuth.js (Auth.js v5) |
| UI Framework | Tailwind CSS + shadcn/ui |
| File Storage | Vercel Blob |
| Deployment | Vercel |
| Video Player | YouTube Embed (iframe) |
| Drag & Drop | dnd-kit |

---

## User Roles

### 1. Guest (ผู้เยี่ยมชม)
- เข้าชมหน้าสาธารณะได้
- ดูรายละเอียดคอร์สได้
- ต้อง Register/Login ก่อนซื้อคอร์ส

### 2. Student (นักเรียน)
- Register/Login ได้
- ซื้อคอร์สและอัพโหลดสลิปได้
- เรียนคอร์สที่ได้รับอนุมัติแล้ว
- ติดตามความก้าวหน้าการเรียน

### 3. Admin (ผู้ดูแลระบบ)
- จัดการคอร์สและบทเรียน
- จัดการผู้ใช้งาน
- อนุมัติ/ปฏิเสธการชำระเงิน
- ดู Dashboard และรายงาน

---

## Features & Pages

### Public Pages (หน้าสาธารณะ)

#### Home Page (`/`)
- Hero section แนะนำ platform
- Featured courses (คอร์สแนะนำ)
- Testimonials
- Call-to-action buttons

#### All Courses Page (`/courses`)
- แสดงรายการคอร์สทั้งหมด
- Filter และ Search คอร์ส
- Pagination
- แสดงราคา, ระยะเวลา, จำนวนบทเรียน

#### Course Detail Page (`/courses/[slug]`)
- รายละเอียดคอร์ส
- รายการบทเรียน (preview สำหรับบทเรียนฟรี)
- ราคาและปุ่มซื้อคอร์ส
- รีวิวจากผู้เรียน

#### About Page (`/about`)
- ข้อมูลเกี่ยวกับ platform
- ทีมงาน

#### Contact Page (`/contact`)
- Contact form
- ข้อมูลติดต่อ

---

### Authentication (ระบบยืนยันตัวตน)

#### Register Page (`/register`)
- Form: ชื่อ, อีเมล, รหัสผ่าน, ยืนยันรหัสผ่าน
- Email validation
- Password strength validation

#### Login Page (`/login`)
- Form: อีเมล, รหัสผ่าน
- Remember me option
- Link ไป Forget Password

#### Forget Password (`/forgot-password`)
- กรอกอีเมลเพื่อรับ link reset password
- ส่ง email พร้อม token

#### Reset Password (`/reset-password/[token]`)
- กรอกรหัสผ่านใหม่
- Token expiration validation

---

### Shopping System (ระบบซื้อคอร์ส)

#### Cart Page (`/cart`)
- รายการคอร์สในตะกร้า
- ปรับจำนวน/ลบคอร์ส
- แสดงราคารวม
- ปุ่ม Checkout

#### Checkout Page (`/checkout`)
- สรุปรายการสั่งซื้อ
- แสดงข้อมูลการโอนเงิน (เลขบัญชี, QR Code)
- Form อัพโหลดสลิปโอน (Vercel Blob)
- Submit order

#### Order History (`/orders`)
- รายการ orders ทั้งหมด
- สถานะ: Pending, Approved, Rejected
- ดูรายละเอียด order

---

### Student Dashboard (หน้านักเรียน)

#### My Courses (`/student/courses`)
- รายการคอร์สที่ลงทะเบียนแล้ว
- แสดง progress แต่ละคอร์ส
- ปุ่มเข้าเรียน

#### Course Learning Page (`/student/courses/[courseId]/learn`)
- **Layout แบบ Udemy:**
  - Sidebar ซ้าย: รายการบทเรียน พร้อมสถานะ (completed/not completed)
  - Content ขวา: YouTube video embed + เนื้อหาบทเรียน
- ปุ่ม "Mark as Completed"
- ปุ่ม Previous/Next lesson
- Progress bar

#### Student Profile (`/student/profile`)
- ดู/แก้ไขข้อมูลส่วนตัว
- เปลี่ยนรหัสผ่าน

---

### Admin Dashboard (หน้า Admin)

#### Dashboard Overview (`/admin`)
- สถิติรวม: จำนวนผู้ใช้, คอร์ส, ยอดขาย
- Orders ที่รอการอนุมัติ
- กราฟแสดงข้อมูล

#### Course Management (`/admin/courses`)
- รายการคอร์สทั้งหมด (CRUD)
- สร้าง/แก้ไข/ลบคอร์ส
- Publish/Unpublish คอร์ส

#### Course Editor (`/admin/courses/[courseId]/edit`)
- แก้ไขข้อมูลคอร์ส
- จัดการบทเรียน (CRUD)
- เพิ่ม YouTube URL สำหรับแต่ละบทเรียน
- **Drag & Drop** จัดลำดับบทเรียน
- Preview คอร์ส

#### User Management (`/admin/users`)
- รายการผู้ใช้ทั้งหมด (CRUD)
- ดู/แก้ไข/ลบผู้ใช้
- เปลี่ยน role (student/admin)
- ดูประวัติการซื้อ

#### Enrollment Management (`/admin/enrollments`)
- รายการ enrollments ทั้งหมด
- Filter by status
- Manual enroll/unenroll

#### Payment Approval (`/admin/payments`)
- รายการ orders ที่รอการอนุมัติ
- ดูสลิปโอน (จาก Vercel Blob)
- ปุ่ม Approve/Reject พร้อมเหตุผล
- ประวัติการอนุมัติ

---

## Database Schema

### Tables

```
User
├── id (String, Primary Key)
├── email (String, Unique)
├── password (String, Hashed)
├── name (String)
├── role (Enum: ADMIN, STUDENT)
├── image (String, Optional)
├── createdAt (DateTime)
└── updatedAt (DateTime)

Course
├── id (String, Primary Key)
├── title (String)
├── slug (String, Unique)
├── description (Text)
├── price (Decimal)
├── thumbnail (String)
├── isPublished (Boolean)
├── createdAt (DateTime)
└── updatedAt (DateTime)

Lesson
├── id (String, Primary Key)
├── courseId (Foreign Key -> Course)
├── title (String)
├── description (Text, Optional)
├── videoUrl (String) // YouTube URL
├── position (Int) // สำหรับ ordering
├── isFree (Boolean) // Preview ได้ไหม
├── createdAt (DateTime)
└── updatedAt (DateTime)

Enrollment
├── id (String, Primary Key)
├── userId (Foreign Key -> User)
├── courseId (Foreign Key -> Course)
├── createdAt (DateTime)
└── updatedAt (DateTime)

Order
├── id (String, Primary Key)
├── userId (Foreign Key -> User)
├── totalAmount (Decimal)
├── status (Enum: PENDING, APPROVED, REJECTED)
├── slipUrl (String) // Vercel Blob URL
├── rejectionReason (String, Optional)
├── approvedAt (DateTime, Optional)
├── approvedBy (Foreign Key -> User, Optional)
├── createdAt (DateTime)
└── updatedAt (DateTime)

OrderItem
├── id (String, Primary Key)
├── orderId (Foreign Key -> Order)
├── courseId (Foreign Key -> Course)
├── price (Decimal) // ราคา ณ ตอนสั่งซื้อ
├── createdAt (DateTime)
└── updatedAt (DateTime)

LessonProgress
├── id (String, Primary Key)
├── lessonId (Foreign Key -> Lesson)
├── userId (Foreign Key -> User)
├── isCompleted (Boolean)
├── completedAt (DateTime, Optional)
├── createdAt (DateTime)
└── updatedAt (DateTime)

PasswordResetToken
├── id (String, Primary Key)
├── email (String)
├── token (String, Unique)
├── expires (DateTime)
├── createdAt (DateTime)
└── updatedAt (DateTime)
```

---

## API Routes

### Auth
- `POST /api/auth/register` - สมัครสมาชิก
- `POST /api/auth/[...nextauth]` - NextAuth handlers
- `POST /api/auth/forgot-password` - ขอ reset password
- `POST /api/auth/reset-password` - Reset password

### Courses
- `GET /api/courses` - รายการคอร์ส (public)
- `GET /api/courses/[slug]` - รายละเอียดคอร์ส (public)
- `POST /api/admin/courses` - สร้างคอร์ส
- `PUT /api/admin/courses/[id]` - แก้ไขคอร์ส
- `DELETE /api/admin/courses/[id]` - ลบคอร์ส

### Lessons
- `GET /api/courses/[courseId]/lessons` - รายการบทเรียน
- `POST /api/admin/courses/[courseId]/lessons` - สร้างบทเรียน
- `PUT /api/admin/lessons/[id]` - แก้ไขบทเรียน
- `DELETE /api/admin/lessons/[id]` - ลบบทเรียน
- `PUT /api/admin/courses/[courseId]/lessons/reorder` - จัดลำดับบทเรียน

### Users
- `GET /api/admin/users` - รายการผู้ใช้
- `POST /api/admin/users` - สร้างผู้ใช้
- `PUT /api/admin/users/[id]` - แก้ไขผู้ใช้
- `DELETE /api/admin/users/[id]` - ลบผู้ใช้

### Cart & Orders
- `GET /api/cart` - ดูตะกร้า
- `POST /api/cart` - เพิ่มคอร์สลงตะกร้า
- `DELETE /api/cart/[courseId]` - ลบคอร์สจากตะกร้า
- `POST /api/orders` - สร้าง order
- `GET /api/orders` - ดู orders ของ user
- `GET /api/orders/[id]` - รายละเอียด order

### Payments
- `POST /api/orders/[id]/upload-slip` - อัพโหลดสลิป
- `GET /api/admin/payments` - รายการรอการอนุมัติ
- `PUT /api/admin/payments/[id]/approve` - อนุมัติ
- `PUT /api/admin/payments/[id]/reject` - ปฏิเสธ

### Enrollments
- `GET /api/admin/enrollments` - รายการ enrollments
- `POST /api/admin/enrollments` - Manual enroll
- `DELETE /api/admin/enrollments/[id]` - Unenroll

### Progress
- `POST /api/progress/[lessonId]/complete` - Mark as completed
- `GET /api/courses/[courseId]/progress` - ดู progress

---

## Development To-Do List

### Phase 1: Project Setup
- [x] สร้างโปรเจค Next.js ด้วย TypeScript
- [x] ติดตั้ง dependencies (Tailwind, shadcn/ui, Prisma, NextAuth, etc.)
- [x] ตั้งค่า Prisma และเชื่อมต่อ PostgreSQL
- [x] สร้าง Database Schema และ run migration
- [x] ตั้งค่า NextAuth.js
- [x] ตั้งค่า Vercel Blob

### Phase 2: Authentication
- [x] สร้างหน้า Register
- [x] สร้างหน้า Login
- [x] สร้างหน้า Forgot Password
- [x] สร้างหน้า Reset Password
- [x] สร้าง API routes สำหรับ auth
- [x] ตั้งค่า middleware สำหรับ protected routes

### Phase 3: Public Pages
- [x] สร้าง Layout หลัก (Navbar, Footer)
- [x] สร้างหน้า Home
- [x] สร้างหน้า All Courses
- [x] สร้างหน้า Course Detail
- [x] สร้างหน้า About
- [x] สร้างหน้า Contact

### Phase 4: Admin Dashboard - Users
- [x] สร้าง Admin Layout (Sidebar navigation)
- [x] สร้างหน้า Admin Dashboard Overview
- [x] สร้างหน้า User Management (List)
- [x] สร้าง Modal/Form สำหรับ Create User
- [x] สร้าง Modal/Form สำหรับ Edit User
- [x] สร้างฟังก์ชัน Delete User
- [x] สร้าง API routes สำหรับ User CRUD

### Phase 5: Admin Dashboard - Courses
- [x] สร้างหน้า Course Management (List)
- [x] สร้างหน้า Create Course
- [x] สร้างหน้า Edit Course
- [x] สร้างฟังก์ชัน Delete Course
- [x] สร้างฟังก์ชัน Publish/Unpublish Course
- [x] สร้าง API routes สำหรับ Course CRUD

### Phase 6: Admin Dashboard - Lessons
- [x] สร้าง Lesson List ในหน้า Edit Course
- [x] สร้าง Modal/Form สำหรับ Create Lesson
- [x] สร้าง Modal/Form สำหรับ Edit Lesson
- [x] สร้างฟังก์ชัน Delete Lesson
- [x] Implement Drag & Drop สำหรับจัดลำดับ Lessons
- [x] สร้าง API routes สำหรับ Lesson CRUD และ Reorder

### Phase 7: Shopping Cart & Checkout
- [x] สร้าง Cart Context/State
- [x] สร้างหน้า Cart
- [x] สร้างหน้า Checkout
- [x] Implement Upload Slip to Vercel Blob
- [x] สร้าง Order Summary
- [x] สร้างหน้า Order History
- [x] สร้าง API routes สำหรับ Cart และ Orders

### Phase 8: Admin - Payment Approval
- [x] สร้างหน้า Payment Approval List
- [x] สร้าง Modal แสดงสลิปโอน
- [x] Implement Approve Order (auto-enroll)
- [x] Implement Reject Order พร้อมเหตุผล
- [x] สร้าง API routes สำหรับ Payment Approval

### Phase 9: Admin - Enrollments
- [x] สร้างหน้า Enrollment Management
- [x] Implement Manual Enroll
- [x] Implement Unenroll
- [x] สร้าง API routes สำหรับ Enrollment CRUD

### Phase 10: Student Dashboard
- [x] สร้าง Student Layout
- [x] สร้างหน้า My Courses (รายการคอร์สที่ลงทะเบียน)
- [x] สร้างหน้า Order History (ประวัติการสั่งซื้อ)
- [x] สร้างหน้า Student Profile
- [x] สร้างฟังก์ชันแก้ไขข้อมูลส่วนตัว
- [x] สร้างฟังก์ชันเปลี่ยนรหัสผ่าน

### Phase 11: Course Learning Page
- [x] สร้าง Learning Page Layout (Sidebar + Content)
- [x] สร้าง Lesson Sidebar Component
- [x] Implement YouTube Video Player
- [x] สร้างเนื้อหาบทเรียน
- [x] Implement "Mark as Completed" button
- [x] Implement Previous/Next navigation
- [x] แสดง Progress bar
- [x] สร้าง API routes สำหรับ Progress

### Phase 12: Polish & Testing
- [x] Responsive design สำหรับ mobile
- [x] Loading states และ Skeletons
- [x] Error handling และ Toast notifications (error.tsx, not-found.tsx)
- [x] SEO optimization (meta tags)
- [ ] Testing (Unit, Integration) - Optional
- [x] Performance optimization (ESLint fixes, unused imports removed)

### Phase 13: Deployment
- [x] ตั้งค่า Environment Variables (.env.example updated)
- [x] Setup PostgreSQL database (Neon configured)
- [x] Config next.config.ts for production
- [ ] Deploy to Vercel
- [ ] Monitor และ fix bugs

---

## Deployment Guide

### ขั้นตอนการ Deploy ไป Vercel

1. **Push code ไป GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo>
   git push -u origin main
   ```

2. **Import Project ใน Vercel**
   - ไปที่ https://vercel.com/new
   - เลือก GitHub repo
   - Vercel จะ detect Next.js automatically

3. **ตั้งค่า Environment Variables ใน Vercel**
   ไปที่ Settings > Environment Variables และเพิ่ม:
   - `DATABASE_URL` - Connection string จาก Neon
   - `AUTH_SECRET` - Generate: `openssl rand -base64 32`
   - `BLOB_READ_WRITE_TOKEN` - จาก Vercel Blob Storage
   - `NEXT_PUBLIC_APP_URL` - https://your-domain.vercel.app

4. **Setup Vercel Blob**
   - ไปที่ Vercel Dashboard > Storage > Create > Blob
   - Copy token ไปใส่ใน Environment Variables

5. **Run Prisma Migrate**
   หลัง deploy ครั้งแรก ให้ run migration:
   ```bash
   npx prisma db push
   ```

6. **สร้าง Admin User**
   ใช้ Prisma Studio หรือ SQL:
   ```sql
   UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-admin@email.com';
   ```

---

## Notes

### Security Considerations
- Hash passwords ด้วย bcrypt
- ใช้ CSRF tokens
- Validate และ sanitize input ทุกที่
- ตรวจสอบ authorization ก่อนทำ action
- Rate limiting สำหรับ login attempts

### UX Considerations
- Loading states ทุกที่ที่มี async operation
- Optimistic updates สำหรับ Cart
- Confirmation dialogs สำหรับ destructive actions
- Toast notifications สำหรับ success/error
- Responsive design

---

*Last Updated: December 2024*
