import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ติดต่อเรา",
  description: "ติดต่อทีมงาน LMS มีคำถามหรือข้อเสนอแนะ? เรายินดีรับฟังจากคุณ",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
