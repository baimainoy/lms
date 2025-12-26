import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnrollmentActions } from "./enrollment-actions";
import { ManualEnrollDialog } from "./manual-enroll-dialog";

async function getEnrollments() {
  return db.enrollment.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
      course: { select: { id: true, title: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

async function getCourses() {
  return db.course.findMany({
    where: { isPublished: true },
    select: { id: true, title: true },
  });
}

async function getStudents() {
  return db.user.findMany({
    where: { role: "STUDENT" },
    select: { id: true, name: true, email: true },
  });
}

export default async function AdminEnrollmentsPage() {
  const [enrollments, courses, students] = await Promise.all([
    getEnrollments(),
    getCourses(),
    getStudents(),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">จัดการการลงทะเบียน</h1>
          <p className="text-gray-500">ดูและจัดการการลงทะเบียนคอร์ส</p>
        </div>
        <ManualEnrollDialog courses={courses} students={students} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>การลงทะเบียนทั้งหมด ({enrollments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">นักเรียน</th>
                  <th className="text-left p-4">คอร์ส</th>
                  <th className="text-left p-4">วันที่ลงทะเบียน</th>
                  <th className="text-right p-4">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((enrollment) => (
                  <tr key={enrollment.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{enrollment.user.name}</p>
                        <p className="text-sm text-gray-500">{enrollment.user.email}</p>
                      </div>
                    </td>
                    <td className="p-4">{enrollment.course.title}</td>
                    <td className="p-4 text-gray-500">
                      {new Date(enrollment.createdAt).toLocaleDateString("th-TH")}
                    </td>
                    <td className="p-4">
                      <EnrollmentActions enrollment={enrollment} />
                    </td>
                  </tr>
                ))}
                {enrollments.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">
                      ยังไม่มีการลงทะเบียน
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
