import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Award, Clock, ArrowRight } from "lucide-react";
import { db } from "@/lib/db";

async function getFeaturedCourses() {
  const courses = await db.course.findMany({
    where: { isPublished: true },
    include: {
      lessons: { select: { id: true } },
      enrollments: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 6,
  });
  return courses;
}

export default async function HomePage() {
  const courses = await getFeaturedCourses();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              เรียนรู้ทักษะใหม่ได้ทุกที่ทุกเวลา
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              แพลตฟอร์มการเรียนรู้ออนไลน์ที่จะช่วยให้คุณพัฒนาทักษะและก้าวหน้าในอาชีพ
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  ดูคอร์สทั้งหมด
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
                  สมัครสมาชิกฟรี
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">50+</div>
              <div className="text-gray-600">คอร์สเรียน</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">1,000+</div>
              <div className="text-gray-600">ผู้เรียน</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">500+</div>
              <div className="text-gray-600">ชั่วโมงเนื้อหา</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">98%</div>
              <div className="text-gray-600">ความพึงพอใจ</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">คอร์สแนะนำ</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              คอร์สยอดนิยมที่คัดสรรมาเพื่อคุณ พร้อมเนื้อหาคุณภาพและอัพเดทล่าสุด
            </p>
          </div>

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
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">ยังไม่มีคอร์สในขณะนี้</p>
            </div>
          )}

          {courses.length > 0 && (
            <div className="text-center mt-12">
              <Link href="/courses">
                <Button variant="outline" size="lg">
                  ดูคอร์สทั้งหมด
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">พร้อมที่จะเริ่มเรียนรู้แล้วหรือยัง?</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            สมัครสมาชิกวันนี้และเริ่มต้นการเรียนรู้ทักษะใหม่ๆ ที่จะช่วยพัฒนาอาชีพของคุณ
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              เริ่มต้นเรียนเลย
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
