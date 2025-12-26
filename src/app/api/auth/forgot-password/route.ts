import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = forgotPasswordSchema.parse(body);

    const user = await db.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        message: "หากอีเมลนี้มีอยู่ในระบบ คุณจะได้รับลิงก์รีเซ็ตรหัสผ่าน",
      });
    }

    // Delete existing tokens for this email
    await db.passwordResetToken.deleteMany({
      where: { email },
    });

    // Generate new token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hour

    await db.passwordResetToken.create({
      data: {
        email,
        token,
        expires,
      },
    });

    // TODO: Send email with reset link
    // For now, just log the token (in production, send email)
    console.log(`Reset token for ${email}: ${token}`);
    console.log(`Reset link: ${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${token}`);

    return NextResponse.json({
      message: "หากอีเมลนี้มีอยู่ในระบบ คุณจะได้รับลิงก์รีเซ็ตรหัสผ่าน",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" },
      { status: 500 }
    );
  }
}
