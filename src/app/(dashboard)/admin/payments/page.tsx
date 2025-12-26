import { db } from "@/lib/db";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrdersList } from "./orders-list";

async function getOrders(status?: string) {
  return db.order.findMany({
    where: status ? { status: status as "PENDING" | "APPROVED" | "REJECTED" } : undefined,
    include: {
      user: { select: { name: true, email: true } },
      items: { include: { course: { select: { title: true } } } },
      approvedBy: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export type OrdersListType = Awaited<ReturnType<typeof getOrders>>;

export default async function AdminPaymentsPage() {
  const [pendingOrders, approvedOrders, rejectedOrders] = await Promise.all([
    getOrders("PENDING"),
    getOrders("APPROVED"),
    getOrders("REJECTED"),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">อนุมัติการชำระเงิน</h1>
        <p className="text-gray-500">ตรวจสอบและอนุมัติการชำระเงิน</p>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">
            รอการอนุมัติ ({pendingOrders.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            อนุมัติแล้ว ({approvedOrders.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            ปฏิเสธ ({rejectedOrders.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          <OrdersList orders={pendingOrders} showActions />
        </TabsContent>

        <TabsContent value="approved" className="mt-6">
          <OrdersList orders={approvedOrders} />
        </TabsContent>

        <TabsContent value="rejected" className="mt-6">
          <OrdersList orders={rejectedOrders} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
