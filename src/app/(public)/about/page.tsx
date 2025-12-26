import { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Heart, Lightbulb, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "เกี่ยวกับเรา",
  description: "เราเชื่อว่าการเรียนรู้ที่ดีควรเข้าถึงได้ง่ายสำหรับทุกคน ไม่ว่าคุณจะอยู่ที่ไหนหรือเวลาใด",
};

export default function AboutPage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold mb-6">เกี่ยวกับเรา</h1>
          <p className="text-xl text-gray-600">
            เราเชื่อว่าการเรียนรู้ที่ดีควรเข้าถึงได้ง่ายสำหรับทุกคน
            ไม่ว่าคุณจะอยู่ที่ไหนหรือเวลาใด
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold">พันธกิจ</h2>
              </div>
              <p className="text-gray-600">
                สร้างแพลตฟอร์มการเรียนรู้ที่ทันสมัยและเข้าถึงได้ง่าย
                เพื่อช่วยให้ผู้คนพัฒนาทักษะและเติบโตในอาชีพของตน
                ด้วยเนื้อหาคุณภาพจากผู้เชี่ยวชาญในแต่ละสาขา
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Lightbulb className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold">วิสัยทัศน์</h2>
              </div>
              <p className="text-gray-600">
                เป็นแพลตฟอร์มการเรียนรู้ออนไลน์ชั้นนำของประเทศไทย
                ที่ช่วยให้ทุกคนสามารถเข้าถึงความรู้และทักษะที่ต้องการ
                เพื่อก้าวหน้าในโลกที่เปลี่ยนแปลงอย่างรวดเร็ว
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">ค่านิยมของเรา</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-4 bg-green-100 rounded-full mb-4">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">คุณภาพ</h3>
              <p className="text-gray-600">
                เราใส่ใจในทุกรายละเอียดของเนื้อหา เพื่อให้ผู้เรียนได้รับประโยชน์สูงสุด
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center p-4 bg-orange-100 rounded-full mb-4">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">ชุมชน</h3>
              <p className="text-gray-600">
                เราสร้างชุมชนแห่งการเรียนรู้ที่ผู้เรียนสามารถแลกเปลี่ยนและช่วยเหลือกัน
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center p-4 bg-blue-100 rounded-full mb-4">
                <Lightbulb className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">นวัตกรรม</h3>
              <p className="text-gray-600">
                เราพัฒนาและปรับปรุงแพลตฟอร์มอย่างต่อเนื่อง เพื่อประสบการณ์การเรียนรู้ที่ดีที่สุด
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gray-50 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-center mb-12">ความสำเร็จของเรา</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">50+</div>
              <div className="text-gray-600 mt-2">คอร์สเรียน</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">1,000+</div>
              <div className="text-gray-600 mt-2">ผู้เรียน</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">20+</div>
              <div className="text-gray-600 mt-2">ผู้สอน</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">98%</div>
              <div className="text-gray-600 mt-2">ความพึงพอใจ</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
