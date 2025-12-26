import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\sก-๙]/g, "")
    .replace(/\s+/g, "-")
    .concat("-", Date.now().toString(36));
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, price, isPublished } = await req.json();

    const slug = generateSlug(title);

    const course = await db.course.create({
      data: {
        title,
        slug,
        description,
        price: price || 0,
        isPublished: isPublished || false,
      },
    });

    return NextResponse.json({ course }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
