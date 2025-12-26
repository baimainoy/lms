import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const CART_COOKIE = "cart";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const cartCookie = cookieStore.get(CART_COOKIE);
    const cartItems: string[] = cartCookie ? JSON.parse(cartCookie.value) : [];

    if (cartItems.length === 0) {
      return NextResponse.json({ items: [], total: 0 });
    }

    const courses = await db.course.findMany({
      where: { id: { in: cartItems }, isPublished: true },
      select: { id: true, title: true, slug: true, price: true, thumbnail: true },
    });

    const total = courses.reduce((sum, course) => sum + Number(course.price), 0);

    return NextResponse.json({ items: courses, total });
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

    const { courseId } = await req.json();

    // Check if already enrolled
    const enrollment = await db.enrollment.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId } },
    });

    if (enrollment) {
      return NextResponse.json({ error: "ALREADY_ENROLLED" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const cartCookie = cookieStore.get(CART_COOKIE);
    const cartItems: string[] = cartCookie ? JSON.parse(cartCookie.value) : [];

    if (cartItems.includes(courseId)) {
      return NextResponse.json({ error: "ALREADY_IN_CART" }, { status: 400 });
    }

    cartItems.push(courseId);

    const response = NextResponse.json({ success: true });
    response.cookies.set(CART_COOKIE, JSON.stringify(cartItems), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json({ error: "Missing courseId" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const cartCookie = cookieStore.get(CART_COOKIE);
    const cartItems: string[] = cartCookie ? JSON.parse(cartCookie.value) : [];

    const newCartItems = cartItems.filter((id) => id !== courseId);

    const response = NextResponse.json({ success: true });
    response.cookies.set(CART_COOKIE, JSON.stringify(newCartItems), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
