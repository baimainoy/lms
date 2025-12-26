import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Clock, Users, PlayCircle, CheckCircle, Lock } from "lucide-react";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { AddToCartButton } from "./add-to-cart-button";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getCourse(slug: string) {
  // Decode slug for proper matching with Thai characters
  const decodedSlug = decodeURIComponent(slug);

  const course = await db.course.findFirst({
    where: {
      slug: decodedSlug,
      isPublished: true
    },
    include: {
      lessons: {
        orderBy: { position: "asc" },
      },
      enrollments: {
        select: { id: true },
      },
    },
  });
  return course;
}

async function checkEnrollment(courseId: string, userId: string | undefined) {
  if (!userId) return false;
  const enrollment = await db.enrollment.findUnique({
    where: {
      userId_courseId: { userId, courseId },
    },
  });
  return !!enrollment;
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const course = await getCourse(slug);

  if (!course) {
    notFound();
  }

  const session = await auth();
  const isEnrolled = await checkEnrollment(course.id, session?.user?.id);

  const totalLessons = course.lessons.length;
  const freeLessons = course.lessons.filter((l) => l.isFree).length;

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Header */}
            <div>
              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-6">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                    <BookOpen className="h-16 w-16 text-blue-400" />
                  </div>
                )}
              </div>
              <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
                <span className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" />
                  {totalLessons} บทเรียน
                </span>
                <span className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {course.enrollments.length} ผู้เรียน
                </span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  อัพเดทล่าสุด {new Date(course.updatedAt).toLocaleDateString("th-TH")}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold mb-4">รายละเอียดคอร์ส</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 whitespace-pre-line">{course.description}</p>
              </div>
            </div>

            <Separator />

            {/* Lessons */}
            <div>
              <h2 className="text-xl font-semibold mb-4">
                เนื้อหาคอร์ส ({totalLessons} บทเรียน)
              </h2>
              <div className="space-y-2">
                {course.lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium">{lesson.title}</p>
                        {lesson.description && (
                          <p className="text-sm text-gray-500 line-clamp-1">
                            {lesson.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {lesson.isFree ? (
                        <Badge variant="secondary" className="gap-1">
                          <PlayCircle className="h-3 w-3" />
                          ดูฟรี
                        </Badge>
                      ) : isEnrolled ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Lock className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600">
                    {Number(course.price) === 0 ? (
                      "ฟรี"
                    ) : (
                      `฿${Number(course.price).toLocaleString()}`
                    )}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEnrolled ? (
                  <Link href={`/student/courses/${course.id}/learn`} className="block">
                    <Button className="w-full" size="lg">
                      <PlayCircle className="mr-2 h-4 w-4" />
                      เข้าเรียน
                    </Button>
                  </Link>
                ) : session ? (
                  <AddToCartButton courseId={course.id} courseName={course.title} />
                ) : (
                  <Link href={`/login?callbackUrl=/courses/${course.slug}`} className="block">
                    <Button className="w-full" size="lg">
                      เข้าสู่ระบบเพื่อซื้อคอร์ส
                    </Button>
                  </Link>
                )}

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">จำนวนบทเรียน</span>
                    <span className="font-medium">{totalLessons} บท</span>
                  </div>
                  {freeLessons > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">บทเรียนฟรี</span>
                      <span className="font-medium">{freeLessons} บท</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">ผู้เรียน</span>
                    <span className="font-medium">{course.enrollments.length} คน</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">เข้าถึงได้ตลอดชีพ</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
