"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Upload, Loader2, CheckCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

interface CartItem {
  id: string;
  title: string;
  price: string;
  thumbnail: string | null;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slip, setSlip] = useState<File | null>(null);
  const [slipPreview, setSlipPreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch("/api/cart");
        const data = await res.json();
        setItems(data.items || []);
        setTotal(data.total || 0);

        if (!data.items || data.items.length === 0) {
          router.push("/cart");
        }
      } catch {
        toast.error("เกิดข้อผิดพลาด");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, [router]);

  const handleSlipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSlip(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSlipPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!slip) {
      toast.error("กรุณาอัพโหลดสลิปโอนเงิน");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("slip", slip);

      const res = await fetch("/api/orders", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "เกิดข้อผิดพลาด");
      }

      toast.success("สั่งซื้อสำเร็จ! รอการอนุมัติจาก Admin");
      router.push("/student/orders");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "เกิดข้อผิดพลาด");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Link href="/cart">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                กลับไปตะกร้า
              </Button>
            </Link>
          </div>

          <h1 className="text-3xl font-bold mb-8">ชำระเงิน</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payment Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>ข้อมูลการโอนเงิน</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="font-medium text-blue-900">ธนาคารกสิกรไทย</p>
                    <p className="text-2xl font-bold text-blue-600 my-2">xxx-x-xxxxx-x</p>
                    <p className="text-blue-800">ชื่อบัญชี: บริษัท LMS จำกัด</p>
                  </div>
                  <p className="text-sm text-gray-500">
                    กรุณาโอนเงินตามจำนวนที่แสดง และอัพโหลดสลิปด้านล่าง
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>อัพโหลดสลิปโอนเงิน</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="slip">สลิปโอนเงิน</Label>
                        <div className="border-2 border-dashed rounded-lg p-6 text-center">
                          {slipPreview ? (
                            <div className="space-y-4">
                              <img
                                src={slipPreview}
                                alt="Slip preview"
                                className="max-h-48 mx-auto rounded"
                              />
                              <p className="text-sm text-gray-500">{slip?.name}</p>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setSlip(null);
                                  setSlipPreview(null);
                                }}
                              >
                                เปลี่ยนรูป
                              </Button>
                            </div>
                          ) : (
                            <label className="cursor-pointer">
                              <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                              <p className="text-gray-500">คลิกเพื่ออัพโหลดสลิป</p>
                              <p className="text-xs text-gray-400 mt-1">
                                PNG, JPG ขนาดไม่เกิน 5MB
                              </p>
                              <Input
                                id="slip"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleSlipChange}
                              />
                            </label>
                          )}
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={!slip || isSubmitting}
                      >
                        {isSubmitting ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle className="mr-2 h-4 w-4" />
                        )}
                        ยืนยันการชำระเงิน
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>สรุปคำสั่งซื้อ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-16 h-10 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                        {item.thumbnail ? (
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                            <BookOpen className="h-4 w-4 text-blue-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.title}</p>
                      </div>
                      <p className="font-medium">
                        ฿{Number(item.price).toLocaleString()}
                      </p>
                    </div>
                  ))}

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>รวมทั้งหมด</span>
                    <span className="text-blue-600">฿{total.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
