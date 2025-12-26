"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { GripVertical, Plus, Pencil, Trash2, Loader2, Video } from "lucide-react";
import { toast } from "sonner";

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string;
  position: number;
  isFree: boolean;
}

function SortableLesson({
  lesson,
  onEdit,
  onDelete,
}: {
  lesson: Lesson;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: lesson.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
      >
        <GripVertical className="h-5 w-5" />
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Video className="h-4 w-4 text-gray-400" />
          <span className="font-medium truncate">{lesson.title}</span>
          {lesson.isFree && (
            <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded">
              ฟรี
            </span>
          )}
        </div>
      </div>
      <div className="flex gap-1">
        <Button size="icon" variant="ghost" onClick={onEdit}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" onClick={onDelete}>
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    </div>
  );
}

export function LessonsList({
  courseId,
  lessons: initialLessons,
}: {
  courseId: string;
  lessons: Lesson[];
}) {
  const router = useRouter();
  const [lessons, setLessons] = useState(initialLessons);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [deletingLesson, setDeletingLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoUrl: "",
    isFree: false,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = lessons.findIndex((l) => l.id === active.id);
      const newIndex = lessons.findIndex((l) => l.id === over.id);
      const newLessons = arrayMove(lessons, oldIndex, newIndex);
      setLessons(newLessons);

      // Save to server
      try {
        await fetch(`/api/admin/courses/${courseId}/lessons/reorder`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lessons: newLessons.map((l, i) => ({ id: l.id, position: i })),
          }),
        });
      } catch {
        toast.error("เกิดข้อผิดพลาดในการบันทึกลำดับ");
      }
    }
  };

  const openCreateDialog = () => {
    setEditingLesson(null);
    setFormData({ title: "", description: "", videoUrl: "", isFree: false });
    setIsDialogOpen(true);
  };

  const openEditDialog = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setFormData({
      title: lesson.title,
      description: lesson.description || "",
      videoUrl: lesson.videoUrl,
      isFree: lesson.isFree,
    });
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (lesson: Lesson) => {
    setDeletingLesson(lesson);
    setIsDeleteOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.videoUrl) {
      toast.error("กรุณากรอกชื่อและ URL วิดีโอ");
      return;
    }

    setIsLoading(true);
    try {
      const url = editingLesson
        ? `/api/admin/courses/${courseId}/lessons/${editingLesson.id}`
        : `/api/admin/courses/${courseId}/lessons`;

      const res = await fetch(url, {
        method: editingLesson ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error();

      toast.success(editingLesson ? "บันทึกสำเร็จ" : "เพิ่มบทเรียนสำเร็จ");
      setIsDialogOpen(false);
      router.refresh();
    } catch {
      toast.error("เกิดข้อผิดพลาด");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingLesson) return;

    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/admin/courses/${courseId}/lessons/${deletingLesson.id}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error();

      toast.success("ลบบทเรียนสำเร็จ");
      setIsDeleteOpen(false);
      router.refresh();
    } catch {
      toast.error("เกิดข้อผิดพลาด");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button onClick={openCreateDialog} className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        เพิ่มบทเรียน
      </Button>

      {lessons.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={lessons} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {lessons.map((lesson) => (
                <SortableLesson
                  key={lesson.id}
                  lesson={lesson}
                  onEdit={() => openEditDialog(lesson)}
                  onDelete={() => openDeleteDialog(lesson)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <p className="text-center text-gray-500 py-8">ยังไม่มีบทเรียน</p>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingLesson ? "แก้ไขบทเรียน" : "เพิ่มบทเรียนใหม่"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>ชื่อบทเรียน</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>รายละเอียด (ไม่บังคับ)</Label>
              <Textarea
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>YouTube URL</Label>
              <Input
                placeholder="https://www.youtube.com/watch?v=..."
                value={formData.videoUrl}
                onChange={(e) =>
                  setFormData({ ...formData, videoUrl: e.target.value })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>ดูฟรี (Preview)</Label>
              <Switch
                checked={formData.isFree}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isFree: checked })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              ยกเลิก
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              บันทึก
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ยืนยันการลบ</DialogTitle>
          </DialogHeader>
          <p>คุณต้องการลบบทเรียน &quot;{deletingLesson?.title}&quot; ใช่หรือไม่?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              ยกเลิก
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              ลบ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
