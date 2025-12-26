import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { resetPasswordSchema } from "@/lib/validations/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, ...passwordData } = body;

    if (!token) {
      return NextResponse.json(
        { error: "Token ไม่ถูกต้อง" },
        { status: 400 }
      );
    }

    const { password } = resetPasswordSchema.parse(passwordData);

    const resetToken = await db.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      return NextResponse.json(
        { error: "Token ไม่ถูกต้องหรือหมดอายุแล้ว" },
        { status: 400 }
      );
    }

    if (resetToken.expires < new Date()) {
      await db.passwordResetToken.delete({
        where: { id: resetToken.id },
      });
      return NextResponse.json(
        { error: "Token หมดอายุแล้ว กรุณาขอรีเซ็ตรหัสผ่านใหม่" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.update({
      where: { email: resetToken.email },
      data: { password: hashedPassword },
    });

    await db.passwordResetToken.delete({
      where: { id: resetToken.id },
    });

    return NextResponse.json({
      message: "รีเซ็ตรหัสผ่านสำเร็จ",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" },
      { status: 500 }
    );
  }
}
