"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Trash2, ShoppingCart, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

interface CartItem {
  id: string;
  title: string;
  slug: string;
  price: string;
  thumbnail: string | null;
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const fetchCart = async () => {
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      setItems(data.items || []);
      setTotal(data.total || 0);
    } catch {
      toast.error("เกิดข้อผิดพลาดในการโหลดตะกร้า");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (courseId: string) => {
    setRemovingId(courseId);
    try {
      await fetch(`/api/cart?courseId=${courseId}`, { method: "DELETE" });
      await fetchCart();
      toast.success("ลบออกจากตะกร้าแล้ว");
    } catch {
      toast.error("เกิดข้อผิดพลาด");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">ตะกร้าสินค้า</h1>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="w-24 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                        {item.thumbnail ? (
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                            <BookOpen className="h-6 w-6 text-blue-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link href={`/courses/${item.slug}`}>
                          <h3 className="font-medium hover:text-blue-600 truncate">
                            {item.title}
                          </h3>
                        </Link>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">
                          ฿{Number(item.price).toLocaleString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemove(item.id)}
                        disabled={removingId === item.id}
                      >
                        {removingId === item.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-red-500" />
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>สรุปคำสั่งซื้อ</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>จำนวนคอร์ส</span>
                      <span>{items.length} รายการ</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>รวมทั้งหมด</span>
                      <span className="text-blue-600">฿{total.toLocaleString()}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link href="/checkout" className="w-full">
                      <Button className="w-full" size="lg">
                        ดำเนินการชำระเงิน
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">ตะกร้าว่างเปล่า</h3>
                <p className="text-gray-500 mb-6">เพิ่มคอร์สที่สนใจลงตะกร้าเลย!</p>
                <Link href="/courses">
                  <Button>เลือกดูคอร์ส</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
