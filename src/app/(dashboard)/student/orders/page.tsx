import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { th } from "date-fns/locale";
import { ShoppingBag, Clock, CheckCircle, XCircle } from "lucide-react";

async function getOrders(userId: string) {
  return db.order.findMany({
    where: { userId },
    include: {
      items: {
        include: { course: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

function getStatusBadge(status: string) {
  switch (status) {
    case "PENDING":
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          <Clock className="h-3 w-3 mr-1" />
          รอตรวจสอบ
        </Badge>
      );
    case "APPROVED":
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          อนุมัติแล้ว
        </Badge>
      );
    case "REJECTED":
      return (
        <Badge variant="secondary" className="bg-red-100 text-red-800">
          <XCircle className="h-3 w-3 mr-1" />
          ไม่อนุมัติ
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

export default async function StudentOrdersPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const orders = await getOrders(session.user.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">ประวัติการสั่งซื้อ</h1>
        <p className="text-gray-500">รายการสั่งซื้อคอร์สของคุณ</p>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    คำสั่งซื้อ #{order.id.slice(-8).toUpperCase()}
                  </CardTitle>
                  {getStatusBadge(order.status)}
                </div>
                <p className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(order.createdAt), {
                    addSuffix: true,
                    locale: th,
                  })}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-10 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                          {item.course.thumbnail ? (
                            <img
                              src={item.course.thumbnail}
                              alt={item.course.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                              <ShoppingBag className="h-4 w-4 text-blue-400" />
                            </div>
                          )}
                        </div>
                        <span className="font-medium">{item.course.title}</span>
                      </div>
                      <span className="font-semibold">
                        ฿{Number(item.price).toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-2 font-bold">
                    <span>รวมทั้งหมด</span>
                    <span className="text-lg">
                      ฿{Number(order.totalAmount).toLocaleString()}
                    </span>
                  </div>
                </div>
                {order.status === "PENDING" && (
                  <p className="text-sm text-yellow-600 mt-4">
                    กรุณารอการตรวจสอบจากผู้ดูแลระบบ
                  </p>
                )}
                {order.status === "REJECTED" && (
                  <p className="text-sm text-red-600 mt-4">
                    การชำระเงินไม่ได้รับการอนุมัติ กรุณาติดต่อผู้ดูแลระบบ
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              ยังไม่มีประวัติการสั่งซื้อ
            </h3>
            <p className="text-gray-500">
              เมื่อคุณสั่งซื้อคอร์ส รายการจะแสดงที่นี่
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
