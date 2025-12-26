import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BookOpen, Users, Search } from "lucide-react";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "คอร์สทั้งหมด",
  description: "เลือกคอร์สที่เหมาะกับคุณและเริ่มต้นการเรียนรู้วันนี้ พร้อมคอร์สคุณภาพจากผู้เชี่ยวชาญ",
};

interface PageProps {
  searchParams: Promise<{ search?: string }>;
}

async function getCourses(search?: string) {
  const courses = await db.course.findMany({
    where: {
      isPublished: true,
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      }),
    },
    include: {
      lessons: { select: { id: true } },
      enrollments: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return courses;
}

export default async function CoursesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const courses = await getCourses(params.search);

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">คอร์สทั้งหมด</h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            เลือกคอร์สที่เหมาะกับคุณและเริ่มต้นการเรียนรู้วันนี้
          </p>

          {/* Search */}
          <form className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                name="search"
                placeholder="ค้นหาคอร์ส..."
                defaultValue={params.search}
                className="pl-10"
              />
            </div>
          </form>
        </div>

        {/* Courses Grid */}
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
                <CardHeader>
                  <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {course.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      {course.lessons.length} บทเรียน
                    </span>
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {course.enrollments.length} ผู้เรียน
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <div className="text-xl font-bold text-blue-600">
                    {Number(course.price) === 0 ? (
                      <Badge variant="secondary">ฟรี</Badge>
                    ) : (
                      `฿${Number(course.price).toLocaleString()}`
                    )}
                  </div>
                  <Link href={`/courses/${course.slug}`}>
                    <Button>ดูรายละเอียด</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">ไม่พบคอร์ส</h3>
            <p className="text-gray-500">
              {params.search
                ? `ไม่พบคอร์สที่ตรงกับ "${params.search}"`
                : "ยังไม่มีคอร์สในขณะนี้"}
            </p>
            {params.search && (
              <Link href="/courses" className="mt-4 inline-block">
                <Button variant="outline">ดูคอร์สทั้งหมด</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
