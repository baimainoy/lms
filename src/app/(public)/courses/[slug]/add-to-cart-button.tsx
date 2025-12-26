"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2, Check } from "lucide-react";
import { toast } from "sonner";

interface AddToCartButtonProps {
  courseId: string;
  courseName: string;
}

export function AddToCartButton({ courseId, courseName }: AddToCartButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === "ALREADY_IN_CART") {
          toast.info("คอร์สนี้อยู่ในตะกร้าแล้ว");
          router.push("/cart");
          return;
        }
        if (data.error === "ALREADY_ENROLLED") {
          toast.info("คุณลงทะเบียนคอร์สนี้แล้ว");
          return;
        }
        throw new Error(data.error);
      }

      setIsAdded(true);
      toast.success(`เพิ่ม "${courseName}" ลงตะกร้าแล้ว`);

      setTimeout(() => {
        setIsAdded(false);
      }, 2000);
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        className="w-full"
        size="lg"
        onClick={handleAddToCart}
        disabled={isLoading || isAdded}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : isAdded ? (
          <Check className="mr-2 h-4 w-4" />
        ) : (
          <ShoppingCart className="mr-2 h-4 w-4" />
        )}
        {isAdded ? "เพิ่มแล้ว" : "เพิ่มลงตะกร้า"}
      </Button>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => router.push("/cart")}
      >
        ไปที่ตะกร้า
      </Button>
    </div>
  );
}
