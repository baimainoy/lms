"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("ส่งข้อความเรียบร้อยแล้ว เราจะติดต่อกลับโดยเร็วที่สุด");
    (e.target as HTMLFormElement).reset();
    setIsLoading(false);
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold mb-6">ติดต่อเรา</h1>
          <p className="text-xl text-gray-600">
            มีคำถามหรือข้อเสนอแนะ? เรายินดีรับฟังจากคุณ
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">อีเมล</h3>
                    <p className="text-gray-600">support@lms.com</p>
                    <p className="text-gray-600">info@lms.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">โทรศัพท์</h3>
                    <p className="text-gray-600">02-xxx-xxxx</p>
                    <p className="text-gray-600">08x-xxx-xxxx</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <MapPin className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">ที่อยู่</h3>
                    <p className="text-gray-600">
                      123 ถนนสุขุมวิท<br />
                      แขวงคลองเตย เขตคลองเตย<br />
                      กรุงเทพมหานคร 10110
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Clock className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">เวลาทำการ</h3>
                    <p className="text-gray-600">จันทร์ - ศุกร์: 9:00 - 18:00</p>
                    <p className="text-gray-600">เสาร์: 9:00 - 12:00</p>
                    <p className="text-gray-600">อาทิตย์: ปิดทำการ</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>ส่งข้อความถึงเรา</CardTitle>
                <CardDescription>
                  กรอกแบบฟอร์มด้านล่างและเราจะติดต่อกลับภายใน 24 ชั่วโมง
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">ชื่อ-นามสกุล</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="กรอกชื่อของคุณ"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">อีเมล</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="example@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="08x-xxx-xxxx"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">หัวข้อ</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="หัวข้อที่ต้องการติดต่อ"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">ข้อความ</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="รายละเอียดที่ต้องการสอบถาม..."
                      rows={5}
                      required
                    />
                  </div>

                  <Button type="submit" size="lg" disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="mr-2 h-4 w-4" />
                    )}
                    ส่งข้อความ
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
