import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = await params;
    const { title, description, videoUrl, isFree } = await req.json();

    // Get max position
    const lastLesson = await db.lesson.findFirst({
      where: { courseId },
      orderBy: { position: "desc" },
    });

    const lesson = await db.lesson.create({
      data: {
        courseId,
        title,
        description,
        videoUrl,
        isFree: isFree || false,
        position: (lastLesson?.position ?? -1) + 1,
      },
    });

    return NextResponse.json({ lesson }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
