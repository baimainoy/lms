import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { LessonPlayer } from "./lesson-player";

interface Props {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{ lesson?: string }>;
}

async function getCourseWithLessons(courseId: string, userId: string) {
  const enrollment = await db.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
    include: {
      course: {
        include: {
          lessons: {
            orderBy: { position: "asc" },
          },
        },
      },
    },
  });

  if (!enrollment) return null;

  // Get progress for all lessons
  const progress = await db.lessonProgress.findMany({
    where: { userId, lesson: { courseId } },
    select: { lessonId: true, isCompleted: true },
  });

  const progressMap = new Map(progress.map((p) => [p.lessonId, p.isCompleted]));

  const lessonsWithProgress = enrollment.course.lessons.map((lesson) => ({
    ...lesson,
    isCompleted: progressMap.get(lesson.id) || false,
  }));

  return {
    ...enrollment.course,
    lessons: lessonsWithProgress,
  };
}

export default async function LearnPage({ params, searchParams }: Props) {
  const session = await auth();
  if (!session) redirect("/login");

  const { courseId } = await params;
  const { lesson: lessonId } = await searchParams;

  const course = await getCourseWithLessons(courseId, session.user.id);
  if (!course) notFound();

  if (course.lessons.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">ยังไม่มีบทเรียน</h2>
          <p className="text-gray-500">คอร์สนี้ยังไม่มีบทเรียน กรุณารอการอัปเดต</p>
        </div>
      </div>
    );
  }

  // Default to first lesson if no lesson specified
  const currentLessonId = lessonId || course.lessons[0].id;
  const currentLessonIndex = course.lessons.findIndex((l) => l.id === currentLessonId);
  const currentLesson = course.lessons[currentLessonIndex];

  if (!currentLesson) notFound();

  const prevLesson = currentLessonIndex > 0 ? course.lessons[currentLessonIndex - 1] : null;
  const nextLesson =
    currentLessonIndex < course.lessons.length - 1
      ? course.lessons[currentLessonIndex + 1]
      : null;

  return (
    <LessonPlayer
      course={course}
      currentLesson={currentLesson}
      prevLesson={prevLesson}
      nextLesson={nextLesson}
    />
  );
}
