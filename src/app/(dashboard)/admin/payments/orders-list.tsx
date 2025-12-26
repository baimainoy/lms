import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PaymentActions } from "./payment-actions";
import type { OrdersListType } from "./page";

interface OrdersListProps {
  orders: OrdersListType;
  showActions?: boolean;
}

export function OrdersList({ orders, showActions = false }: OrdersListProps) {
  if (orders.length === 0) {
    return <p className="text-center text-gray-500 py-8">ไม่มีรายการ</p>;
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{order.user.name}</span>
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
                <p className="text-sm text-gray-500">{order.user.email}</p>
                <div className="text-sm">
                  <span className="text-gray-500">คอร์ส: </span>
                  {order.items.map((item) => item.course.title).join(", ")}
                </div>
                <p className="text-lg font-bold text-blue-600">
                  ฿{Number(order.totalAmount).toLocaleString()}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(order.createdAt).toLocaleString("th-TH")}
                </p>
                {order.approvedBy && (
                  <p className="text-xs text-gray-500">
                    อนุมัติโดย: {order.approvedBy.name}
                  </p>
                )}
                {order.rejectionReason && (
                  <p className="text-sm text-red-500">
                    เหตุผล: {order.rejectionReason}
                  </p>
                )}
              </div>

              <div className="flex flex-col items-end gap-2">
                {order.slipUrl && (
                  <a
                    href={order.slipUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <img
                      src={order.slipUrl}
                      alt="Payment slip"
                      className="w-32 h-auto rounded border hover:opacity-80 transition-opacity"
                    />
                  </a>
                )}
                {showActions && order.status === "PENDING" && (
                  <PaymentActions order={{ id: order.id }} />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
