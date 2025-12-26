import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <FileQuestion className="h-24 w-24 text-gray-300 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          ไม่พบหน้าที่คุณต้องการ
        </h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          หน้าที่คุณกำลังมองหาอาจถูกลบ เปลี่ยนชื่อ หรือไม่มีอยู่ในระบบ
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button>
              <Home className="mr-2 h-4 w-4" />
              กลับหน้าแรก
            </Button>
          </Link>
          <Link href="/courses">
            <Button variant="outline">ดูคอร์สทั้งหมด</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
