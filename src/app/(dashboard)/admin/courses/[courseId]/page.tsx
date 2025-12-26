import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseForm } from "./course-form";
import { LessonsList } from "./lessons-list";

interface PageProps {
  params: Promise<{ courseId: string }>;
}

async function getCourse(courseId: string) {
  return db.course.findUnique({
    where: { id: courseId },
    include: {
      lessons: { orderBy: { position: "asc" } },
    },
  });
}

export default async function CourseEditPage({ params }: PageProps) {
  const { courseId } = await params;
  const course = await getCourse(courseId);

  if (!course) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">แก้ไขคอร์ส</h1>
        <p className="text-gray-500">แก้ไขข้อมูลคอร์สและจัดการบทเรียน</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Course Info */}
        <Card>
          <CardHeader>
            <CardTitle>ข้อมูลคอร์ส</CardTitle>
          </CardHeader>
          <CardContent>
            <CourseForm course={{
              id: course.id,
              title: course.title,
              slug: course.slug,
              description: course.description,
              price: Number(course.price),
              thumbnail: course.thumbnail,
              isPublished: course.isPublished,
            }} />
          </CardContent>
        </Card>

        {/* Lessons */}
        <Card>
          <CardHeader>
            <CardTitle>บทเรียน ({course.lessons.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <LessonsList courseId={course.id} lessons={course.lessons} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
