"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CheckCircle,
  Circle,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  PlayCircle,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Lesson {
  id: string;
  title: string;
  videoUrl: string;
  position: number;
  isCompleted: boolean;
}

interface Course {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface LessonPlayerProps {
  course: Course;
  currentLesson: Lesson;
  prevLesson: Lesson | null;
  nextLesson: Lesson | null;
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function LessonPlayer({
  course,
  currentLesson,
  prevLesson,
  nextLesson,
}: LessonPlayerProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const [lessons, setLessons] = useState(course.lessons);

  const completedCount = lessons.filter((l) => l.isCompleted).length;
  const progressPercent = Math.round((completedCount / lessons.length) * 100);

  const currentLessonData = lessons.find((l) => l.id === currentLesson.id);
  const youtubeId = extractYouTubeId(currentLesson.videoUrl);

  const handleMarkComplete = async () => {
    setIsMarkingComplete(true);
    try {
      const res = await fetch("/api/student/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: currentLesson.id,
          isCompleted: !currentLessonData?.isCompleted,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update progress");
      }

      setLessons((prev) =>
        prev.map((l) =>
          l.id === currentLesson.id
            ? { ...l, isCompleted: !l.isCompleted }
            : l
        )
      );

      toast.success(
        currentLessonData?.isCompleted
          ? "ยกเลิกการเรียนจบบทแล้ว"
          : "ทำเครื่องหมายเรียนจบบทแล้ว"
      );
    } catch {
      toast.error("เกิดข้อผิดพลาด");
    } finally {
      setIsMarkingComplete(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gray-50">
      {/* Sidebar */}
      <div
        className={cn(
          "bg-white border-r transition-all duration-300 flex flex-col",
          sidebarOpen ? "w-80" : "w-0 overflow-hidden"
        )}
      >
        <div className="p-4 border-b">
          <Link href="/student/courses" className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-3">
            <ArrowLeft className="h-4 w-4 mr-1" />
            กลับไปคอร์สของฉัน
          </Link>
          <h2 className="font-semibold line-clamp-2">{course.title}</h2>
          <div className="mt-3">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-500">ความก้าวหน้า</span>
              <span className="font-medium">{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
            <p className="text-xs text-gray-500 mt-1">
              {completedCount}/{lessons.length} บท
            </p>
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2">
            {lessons.map((lesson, index) => (
              <Link
                key={lesson.id}
                href={`/student/courses/${course.id}/learn?lesson=${lesson.id}`}
              >
                <div
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg transition-colors",
                    lesson.id === currentLesson.id
                      ? "bg-blue-50 text-blue-700"
                      : "hover:bg-gray-100"
                  )}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {lesson.isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : lesson.id === currentLesson.id ? (
                      <PlayCircle className="h-5 w-5 text-blue-600" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-2">
                      {index + 1}. {lesson.title}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <h1 className="font-medium line-clamp-1">{currentLesson.title}</h1>
          </div>
          <Button
            variant={currentLessonData?.isCompleted ? "outline" : "default"}
            onClick={handleMarkComplete}
            disabled={isMarkingComplete}
          >
            {currentLessonData?.isCompleted ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                เรียนจบแล้ว
              </>
            ) : (
              <>
                <Circle className="h-4 w-4 mr-2" />
                ทำเครื่องหมายว่าเรียนจบ
              </>
            )}
          </Button>
        </div>

        {/* Video Area */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            {youtubeId ? (
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">ไม่พบวิดีโอ</p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              {prevLesson ? (
                <Link href={`/student/courses/${course.id}/learn?lesson=${prevLesson.id}`}>
                  <Button variant="outline">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    บทก่อนหน้า
                  </Button>
                </Link>
              ) : (
                <div />
              )}
              {nextLesson ? (
                <Link href={`/student/courses/${course.id}/learn?lesson=${nextLesson.id}`}>
                  <Button>
                    บทถัดไป
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              ) : (
                <Link href="/student/courses">
                  <Button variant="outline">กลับไปคอร์สของฉัน</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
