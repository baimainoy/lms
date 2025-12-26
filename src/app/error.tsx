"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <AlertTriangle className="h-24 w-24 text-red-400 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          เกิดข้อผิดพลาด
        </h1>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          ขออภัย เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่อีกครั้ง
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset}>
            <RefreshCw className="mr-2 h-4 w-4" />
            ลองใหม่อีกครั้ง
          </Button>
          <Link href="/">
            <Button variant="outline">
              <Home className="mr-2 h-4 w-4" />
              กลับหน้าแรก
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
