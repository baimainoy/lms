import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, PlayCircle } from "lucide-react";

async function getEnrolledCourses(userId: string) {
  const enrollments = await db.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          lessons: {
            select: { id: true },
          },
        },
      },
    },
  });

  // Get progress for each course
  const coursesWithProgress = await Promise.all(
    enrollments.map(async (enrollment) => {
      const totalLessons = enrollment.course.lessons.length;
      const completedLessons = await db.lessonProgress.count({
        where: {
          userId,
          lesson: { courseId: enrollment.course.id },
          isCompleted: true,
        },
      });

      return {
        ...enrollment.course,
        totalLessons,
        completedLessons,
        progress: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
      };
    })
  );

  return coursesWithProgress;
}

export default async function StudentCoursesPage() {
  const session = await auth();
  if (!session) return null;

  const courses = await getEnrolledCourses(session.user.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">คอร์สของฉัน</h1>
        <p className="text-gray-500">คอร์สที่คุณลงทะเบียนเรียน</p>
      </div>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden">
              <div className="aspect-video bg-gray-200 relative">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                    <BookOpen className="h-12 w-12 text-blue-400" />
                  </div>
                )}
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="line-clamp-1">{course.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">ความก้าวหน้า</span>
                  <span className="font-medium">{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
                <p className="text-sm text-gray-500">
                  เรียนแล้ว {course.completedLessons}/{course.totalLessons} บท
                </p>
              </CardContent>
              <CardFooter>
                <Link href={`/student/courses/${course.id}/learn`} className="w-full">
                  <Button className="w-full">
                    <PlayCircle className="mr-2 h-4 w-4" />
                    {course.progress > 0 ? "เรียนต่อ" : "เริ่มเรียน"}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              ยังไม่มีคอร์สที่ลงทะเบียน
            </h3>
            <p className="text-gray-500 mb-6">เลือกคอร์สที่สนใจและเริ่มเรียนเลย!</p>
            <Link href="/courses">
              <Button>เลือกดูคอร์ส</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
