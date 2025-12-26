import Link from "next/link";
import { BookOpen } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold text-white">LMS</span>
            </Link>
            <p className="text-sm">
              ระบบจัดการการเรียนรู้ออนไลน์ที่ช่วยให้คุณเรียนรู้ได้ทุกที่ทุกเวลา
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">ลิงก์ด่วน</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/courses" className="text-sm hover:text-white transition-colors">
                  คอร์สทั้งหมด
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm hover:text-white transition-colors">
                  เกี่ยวกับเรา
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:text-white transition-colors">
                  ติดต่อเรา
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">ช่วยเหลือ</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-sm hover:text-white transition-colors">
                  คำถามที่พบบ่อย
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm hover:text-white transition-colors">
                  ข้อกำหนดการใช้งาน
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm hover:text-white transition-colors">
                  นโยบายความเป็นส่วนตัว
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">ติดต่อเรา</h3>
            <ul className="space-y-2 text-sm">
              <li>อีเมล: support@lms.com</li>
              <li>โทร: 02-xxx-xxxx</li>
              <li>เวลาทำการ: จันทร์-ศุกร์ 9:00-18:00</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} LMS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
