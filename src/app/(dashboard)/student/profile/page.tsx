import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProfileForm } from "./profile-form";
import { PasswordForm } from "./password-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

async function getUser(userId: string) {
  return db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
    },
  });
}

export default async function StudentProfilePage() {
  const session = await auth();
  if (!session) redirect("/login");

  const user = await getUser(session.user.id);
  if (!user) redirect("/login");

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">โปรไฟล์</h1>
        <p className="text-gray-500">จัดการข้อมูลส่วนตัวของคุณ</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ข้อมูลส่วนตัว</CardTitle>
          <CardDescription>แก้ไขชื่อและข้อมูลของคุณ</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm user={user} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>เปลี่ยนรหัสผ่าน</CardTitle>
          <CardDescription>อัปเดตรหัสผ่านเพื่อความปลอดภัย</CardDescription>
        </CardHeader>
        <CardContent>
          <PasswordForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ข้อมูลบัญชี</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-500">อีเมล</span>
            <span className="font-medium">{user.email}</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="text-gray-500">สมัครสมาชิกเมื่อ</span>
            <span className="font-medium">
              {new Date(user.createdAt).toLocaleDateString("th-TH", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
