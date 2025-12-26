import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserActions } from "./user-actions";
import { CreateUserDialog } from "./create-user-dialog";

async function getUsers() {
  return db.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      enrollments: { select: { id: true } },
      orders: { select: { id: true } },
    },
  });
}

export default async function AdminUsersPage() {
  const users = await getUsers();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">จัดการผู้ใช้</h1>
          <p className="text-gray-500">จัดการผู้ใช้ทั้งหมดในระบบ</p>
        </div>
        <CreateUserDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ผู้ใช้ทั้งหมด ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">ชื่อ</th>
                  <th className="text-left p-4">อีเมล</th>
                  <th className="text-left p-4">บทบาท</th>
                  <th className="text-left p-4">คอร์ส</th>
                  <th className="text-left p-4">วันที่สมัคร</th>
                  <th className="text-right p-4">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{user.name}</td>
                    <td className="p-4 text-gray-500">{user.email}</td>
                    <td className="p-4">
                      <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                        {user.role === "ADMIN" ? "Admin" : "Student"}
                      </Badge>
                    </td>
                    <td className="p-4">{user.enrollments.length} คอร์ส</td>
                    <td className="p-4 text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString("th-TH")}
                    </td>
                    <td className="p-4">
                      <UserActions user={user} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
