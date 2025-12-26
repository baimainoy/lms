import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, CreditCard, TrendingUp } from "lucide-react";
import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

async function getDashboardStats() {
  const [usersCount, coursesCount, pendingPayments, totalRevenue] = await Promise.all([
    db.user.count(),
    db.course.count(),
    db.order.count({ where: { status: "PENDING" } }),
    db.order.aggregate({
      where: { status: "APPROVED" },
      _sum: { totalAmount: true },
    }),
  ]);

  return {
    usersCount,
    coursesCount,
    pendingPayments,
    totalRevenue: Number(totalRevenue._sum.totalAmount || 0),
  };
}

async function getRecentOrders() {
  return db.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      items: { include: { course: { select: { title: true } } } },
    },
  });
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  const recentOrders = await getRecentOrders();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">แดชบอร์ด</h1>
        <p className="text-gray-500">ภาพรวมของระบบ</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              ผู้ใช้ทั้งหมด
            </CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.usersCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              คอร์สทั้งหมด
            </CardTitle>
            <BookOpen className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.coursesCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              รอการอนุมัติ
            </CardTitle>
            <CreditCard className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.pendingPayments}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              รายได้รวม
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ฿{stats.totalRevenue.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>คำสั่งซื้อล่าสุด</CardTitle>
          <Link href="/admin/payments">
            <Button variant="outline" size="sm">ดูทั้งหมด</Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{order.user.name}</p>
                    <p className="text-sm text-gray-500">{order.user.email}</p>
                    <p className="text-sm text-gray-500">
                      {order.items.map((item) => item.course.title).join(", ")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ฿{Number(order.totalAmount).toLocaleString()}
                    </p>
                    <Badge
                      variant={
                        order.status === "APPROVED"
                          ? "default"
                          : order.status === "REJECTED"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {order.status === "APPROVED"
                        ? "อนุมัติแล้ว"
                        : order.status === "REJECTED"
                        ? "ปฏิเสธ"
                        : "รอการอนุมัติ"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">ยังไม่มีคำสั่งซื้อ</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
