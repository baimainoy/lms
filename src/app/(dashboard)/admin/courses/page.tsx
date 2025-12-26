import Link from "next/link";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Pencil } from "lucide-react";
import { CreateCourseDialog } from "./create-course-dialog";
import { CourseActions } from "./course-actions";

async function getCourses() {
  return db.course.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      lessons: { select: { id: true } },
      enrollments: { select: { id: true } },
    },
  });
}

export default async function AdminCoursesPage() {
  const courses = await getCourses();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">จัดการคอร์ส</h1>
          <p className="text-gray-500">สร้างและจัดการคอร์สทั้งหมด</p>
        </div>
        <CreateCourseDialog />
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
                <div className="absolute top-2 right-2">
                  <Badge variant={course.isPublished ? "default" : "secondary"}>
                    {course.isPublished ? "เผยแพร่แล้ว" : "ฉบับร่าง"}
                  </Badge>
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="line-clamp-1">{course.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                  {course.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    {course.lessons.length} บทเรียน
                  </span>
                  <span className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {course.enrollments.length} ผู้เรียน
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-600">
                    ฿{Number(course.price).toLocaleString()}
                  </span>
                  <div className="flex gap-2">
                    <Link href={`/admin/courses/${course.id}`}>
                      <Button size="sm" variant="outline">
                        <Pencil className="h-4 w-4 mr-1" />
                        แก้ไข
                      </Button>
                    </Link>
                    <CourseActions course={{ id: course.id, title: course.title, isPublished: course.isPublished }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">ยังไม่มีคอร์ส</p>
            <CreateCourseDialog />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
