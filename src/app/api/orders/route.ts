import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const CART_COOKIE = "cart";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await db.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: { include: { course: { select: { title: true, slug: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }

    const formData = await req.formData();
    const slip = formData.get("slip") as File;

    if (!slip) {
      return NextResponse.json({ error: "กรุณาอัพโหลดสลิป" }, { status: 400 });
    }

    // Get cart items
    const cookieStore = await cookies();
    const cartCookie = cookieStore.get(CART_COOKIE);
    const cartItems: string[] = cartCookie ? JSON.parse(cartCookie.value) : [];

    if (cartItems.length === 0) {
      return NextResponse.json({ error: "ตะกร้าว่าง" }, { status: 400 });
    }

    // Get courses
    const courses = await db.course.findMany({
      where: { id: { in: cartItems }, isPublished: true },
    });

    if (courses.length === 0) {
      return NextResponse.json({ error: "ไม่พบคอร์ส" }, { status: 400 });
    }

    // Check if already enrolled in any course
    const existingEnrollments = await db.enrollment.findMany({
      where: {
        userId: session.user.id,
        courseId: { in: courses.map((c) => c.id) },
      },
    });

    if (existingEnrollments.length > 0) {
      return NextResponse.json(
        { error: "คุณลงทะเบียนคอร์สบางรายการแล้ว" },
        { status: 400 }
      );
    }

    let slipUrl: string;

    // Check if Vercel Blob is configured
    if (process.env.BLOB_READ_WRITE_TOKEN && !process.env.BLOB_READ_WRITE_TOKEN.includes("your-")) {
      // Use Vercel Blob in production
      const { put } = await import("@vercel/blob");
      const slipBlob = await put(
        `slips/${session.user.id}-${Date.now()}.${slip.name.split(".").pop()}`,
        slip,
        { access: "public" }
      );
      slipUrl = slipBlob.url;
    } else {
      // Save locally in development
      const bytes = await slip.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create uploads directory if not exists
      const uploadsDir = path.join(process.cwd(), "public", "uploads", "slips");
      await mkdir(uploadsDir, { recursive: true });

      // Save file
      const fileName = `${session.user.id}-${Date.now()}.${slip.name.split(".").pop()}`;
      const filePath = path.join(uploadsDir, fileName);
      await writeFile(filePath, buffer);

      slipUrl = `/uploads/slips/${fileName}`;
    }

    // Calculate total
    const totalAmount = courses.reduce((sum, course) => sum + Number(course.price), 0);

    // Create order
    const order = await db.order.create({
      data: {
        userId: session.user.id,
        totalAmount,
        slipUrl,
        items: {
          create: courses.map((course) => ({
            courseId: course.id,
            price: course.price,
          })),
        },
      },
      include: { items: true },
    });

    // Clear cart
    const response = NextResponse.json({ order }, { status: 201 });
    response.cookies.set(CART_COOKIE, "[]", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
