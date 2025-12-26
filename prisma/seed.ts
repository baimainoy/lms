import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Create Admin User
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@test.com" },
    update: {},
    create: {
      email: "admin@test.com",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("✅ Created admin:", admin.email);

  // Create Student Users
  const studentPassword = await bcrypt.hash("student123", 10);
  const student1 = await prisma.user.upsert({
    where: { email: "student@test.com" },
    update: {},
    create: {
      email: "student@test.com",
      name: "นักเรียน ทดสอบ",
      password: studentPassword,
      role: "STUDENT",
    },
  });
  console.log("✅ Created student:", student1.email);

  const student2 = await prisma.user.upsert({
    where: { email: "somchai@test.com" },
    update: {},
    create: {
      email: "somchai@test.com",
      name: "สมชาย ใจดี",
      password: studentPassword,
      role: "STUDENT",
    },
  });
  console.log("✅ Created student:", student2.email);

  // Create Courses
  const course1 = await prisma.course.upsert({
    where: { slug: "nextjs-fundamentals" },
    update: {},
    create: {
      title: "Next.js Fundamentals",
      slug: "nextjs-fundamentals",
      description: "เรียนรู้พื้นฐาน Next.js ตั้งแต่เริ่มต้น รวมถึง App Router, Server Components, และ API Routes พร้อมตัวอย่างโปรเจคจริง",
      price: 1290,
      isPublished: true,
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
    },
  });
  console.log("✅ Created course:", course1.title);

  const course2 = await prisma.course.upsert({
    where: { slug: "react-typescript" },
    update: {},
    create: {
      title: "React + TypeScript Complete Guide",
      slug: "react-typescript",
      description: "คอร์สสอน React ร่วมกับ TypeScript แบบครบวงจร ตั้งแต่พื้นฐานจนถึงขั้นสูง รวมถึง Hooks, Context, และ State Management",
      price: 1590,
      isPublished: true,
      thumbnail: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800",
    },
  });
  console.log("✅ Created course:", course2.title);

  const course3 = await prisma.course.upsert({
    where: { slug: "tailwindcss-mastery" },
    update: {},
    create: {
      title: "TailwindCSS Mastery",
      slug: "tailwindcss-mastery",
      description: "เชี่ยวชาญ TailwindCSS สร้าง UI สวยงามและ Responsive ได้อย่างรวดเร็ว พร้อมเทคนิคการจัดการ Design System",
      price: 990,
      isPublished: true,
      thumbnail: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800",
    },
  });
  console.log("✅ Created course:", course3.title);

  const course4 = await prisma.course.upsert({
    where: { slug: "prisma-database" },
    update: {},
    create: {
      title: "Prisma ORM สำหรับ Node.js",
      slug: "prisma-database",
      description: "เรียนรู้การใช้ Prisma ORM จัดการฐานข้อมูล PostgreSQL, MySQL, MongoDB พร้อมเทคนิค Query และ Relations",
      price: 1190,
      isPublished: true,
      thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800",
    },
  });
  console.log("✅ Created course:", course4.title);

  const course5 = await prisma.course.upsert({
    where: { slug: "free-html-css" },
    update: {},
    create: {
      title: "HTML & CSS พื้นฐาน (ฟรี)",
      slug: "free-html-css",
      description: "คอร์สฟรี! เรียนรู้พื้นฐาน HTML และ CSS สำหรับผู้เริ่มต้น สร้างเว็บไซต์แรกของคุณได้ภายใน 1 วัน",
      price: 0,
      isPublished: true,
      thumbnail: "https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=800",
    },
  });
  console.log("✅ Created course:", course5.title);

  // Create Lessons for Course 1 (Next.js)
  const lessons1 = [
    { title: "แนะนำ Next.js และ Setup โปรเจค", videoUrl: "https://www.youtube.com/watch?v=ZVnjOPwW4ZA", position: 1 },
    { title: "App Router และ File-based Routing", videoUrl: "https://www.youtube.com/watch?v=ZVnjOPwW4ZA", position: 2 },
    { title: "Server Components vs Client Components", videoUrl: "https://www.youtube.com/watch?v=ZVnjOPwW4ZA", position: 3 },
    { title: "Data Fetching และ Caching", videoUrl: "https://www.youtube.com/watch?v=ZVnjOPwW4ZA", position: 4 },
    { title: "API Routes และ Server Actions", videoUrl: "https://www.youtube.com/watch?v=ZVnjOPwW4ZA", position: 5 },
    { title: "Authentication กับ NextAuth.js", videoUrl: "https://www.youtube.com/watch?v=ZVnjOPwW4ZA", position: 6 },
    { title: "Deployment ไป Vercel", videoUrl: "https://www.youtube.com/watch?v=ZVnjOPwW4ZA", position: 7 },
  ];

  for (const lesson of lessons1) {
    await prisma.lesson.upsert({
      where: {
        id: `${course1.id}-lesson-${lesson.position}`,
      },
      update: {},
      create: {
        id: `${course1.id}-lesson-${lesson.position}`,
        courseId: course1.id,
        title: lesson.title,
        videoUrl: lesson.videoUrl,
        position: lesson.position,
        isFree: lesson.position === 1,
      },
    });
  }
  console.log("✅ Created 7 lessons for:", course1.title);

  // Create Lessons for Course 2 (React + TypeScript)
  const lessons2 = [
    { title: "TypeScript พื้นฐานสำหรับ React", videoUrl: "https://www.youtube.com/watch?v=ZVnjOPwW4ZA", position: 1 },
    { title: "การสร้าง React App ด้วย Vite + TypeScript", videoUrl: "https://www.youtube.com/watch?v=ZVnjOPwW4ZA", position: 2 },
    { title: "Props และ State ใน TypeScript", videoUrl: "https://www.youtube.com/watch?v=ZVnjOPwW4ZA", position: 3 },
    { title: "Custom Hooks พร้อม Types", videoUrl: "https://www.youtube.com/watch?v=ZVnjOPwW4ZA", position: 4 },
    { title: "Context API กับ TypeScript", videoUrl: "https://www.youtube.com/watch?v=ZVnjOPwW4ZA", position: 5 },
    { title: "React Query และ Fetch Data", videoUrl: "https://www.youtube.com/watch?v=ZVnjOPwW4ZA", position: 6 },
  ];

  for (const lesson of lessons2) {
    await prisma.lesson.upsert({
      where: {
        id: `${course2.id}-lesson-${lesson.position}`,
      },
      update: {},
      create: {
        id: `${course2.id}-lesson-${lesson.position}`,
        courseId: course2.id,
        title: lesson.title,
        videoUrl: lesson.videoUrl,
        position: lesson.position,
        isFree: lesson.position === 1,
      },
    });
  }
  console.log("✅ Created 6 lessons for:", course2.title);

  // Create Lessons for Course 3 (TailwindCSS)
  const lessons3 = [
    { title: "ติดตั้ง TailwindCSS", videoUrl: "https://www.youtube.com/watch?v=ZVnjOPwW4ZA", position: 1 },
    { title: "Utility Classes พื้นฐาน", videoUrl: "https://www.youtube.com/watch?v=ZVnjOPwW4ZA", position: 2 },
    { title: "Responsive Design", videoUrl: "https://www.youtube.com/watch?v=ZVnjOPwW4ZA", position: 3 },
    { title: "Dark Mode", videoUrl: "https://www.youtube.com/watch?v=ZVnjOPwW4ZA", position: 4 },
    { title: "Custom Configuration", videoUrl: "https://www.youtube.com/watch?v=ZVnjOPwW4ZA", position: 5 },
  ];

  for (const lesson of lessons3) {
    await prisma.lesson.upsert({
      where: {
        id: `${course3.id}-lesson-${lesson.position}`,
      },
      update: {},
      create: {
        id: `${course3.id}-lesson-${lesson.position}`,
        courseId: course3.id,
        title: lesson.title,
        videoUrl: lesson.videoUrl,
        position: lesson.position,
        isFree: lesson.position === 1,
      },
    });
  }
  console.log("✅ Created 5 lessons for:", course3.title);

  // Create Lessons for Free Course
  const lessons5 = [
    { title: "HTML คืออะไร?", videoUrl: "https://www.youtube.com/watch?v=ZVnjOPwW4ZA", position: 1 },
    { title: "โครงสร้าง HTML Document", videoUrl: "https://www.youtube.com/watch?v=ZVnjOPwW4ZA", position: 2 },
    { title: "CSS พื้นฐาน", videoUrl: "https://www.youtube.com/watch?v=ZVnjOPwW4ZA", position: 3 },
    { title: "Flexbox Layout", videoUrl: "https://www.youtube.com/watch?v=ZVnjOPwW4ZA", position: 4 },
  ];

  for (const lesson of lessons5) {
    await prisma.lesson.upsert({
      where: {
        id: `${course5.id}-lesson-${lesson.position}`,
      },
      update: {},
      create: {
        id: `${course5.id}-lesson-${lesson.position}`,
        courseId: course5.id,
        title: lesson.title,
        videoUrl: lesson.videoUrl,
        position: lesson.position,
        isFree: true, // All free
      },
    });
  }
  console.log("✅ Created 4 lessons for:", course5.title);

  // Enroll student1 in some courses
  await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: student1.id,
        courseId: course1.id,
      },
    },
    update: {},
    create: {
      userId: student1.id,
      courseId: course1.id,
    },
  });

  await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: student1.id,
        courseId: course5.id,
      },
    },
    update: {},
    create: {
      userId: student1.id,
      courseId: course5.id,
    },
  });
  console.log("✅ Enrolled student in 2 courses");

  // Add some lesson progress
  const course1Lessons = await prisma.lesson.findMany({
    where: { courseId: course1.id },
    orderBy: { position: "asc" },
    take: 3,
  });

  for (const lesson of course1Lessons) {
    await prisma.lessonProgress.upsert({
      where: {
        lessonId_userId: {
          lessonId: lesson.id,
          userId: student1.id,
        },
      },
      update: {},
      create: {
        lessonId: lesson.id,
        userId: student1.id,
        isCompleted: true,
        completedAt: new Date(),
      },
    });
  }
  console.log("✅ Added lesson progress");

  console.log("\n🎉 Seed completed successfully!");
  console.log("\n📝 Login credentials:");
  console.log("   Admin: admin@test.com / admin123");
  console.log("   Student: student@test.com / student123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
