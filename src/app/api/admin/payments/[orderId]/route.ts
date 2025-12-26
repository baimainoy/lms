import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await params;
    const { action, reason } = await req.json();

    const order = await db.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: "ไม่พบ Order" }, { status: 404 });
    }

    if (order.status !== "PENDING") {
      return NextResponse.json(
        { error: "Order นี้ได้รับการดำเนินการแล้ว" },
        { status: 400 }
      );
    }

    if (action === "approve") {
      // Update order status
      await db.order.update({
        where: { id: orderId },
        data: {
          status: "APPROVED",
          approvedAt: new Date(),
          approvedById: session.user.id,
        },
      });

      // Create enrollments for each course
      await db.enrollment.createMany({
        data: order.items.map((item) => ({
          userId: order.userId,
          courseId: item.courseId,
        })),
        skipDuplicates: true,
      });

      return NextResponse.json({ success: true, status: "APPROVED" });
    } else if (action === "reject") {
      await db.order.update({
        where: { id: orderId },
        data: {
          status: "REJECTED",
          rejectionReason: reason,
          approvedById: session.user.id,
        },
      });

      return NextResponse.json({ success: true, status: "REJECTED" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
