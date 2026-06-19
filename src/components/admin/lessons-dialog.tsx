"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  PlayCircle,
  Lock,
  Unlock,
  GripVertical,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { MediaUpload } from "@/components/shared/media-upload";
import { FieldError } from "@/components/shared/field-error";
import { lessonSchema, type LessonInput } from "@/lib/validations/content";
import { api } from "@/lib/api-client";
import { toast } from "@/store/toast";
import { formatDuration } from "@/lib/utils";

interface Lesson {
  _id: string;
  title: string;
  videoUrl: string;
  videoPublicId?: string | null;
  durationMinutes: number;
  order: number;
  isFree: boolean;
}

export function LessonsDialog({
  courseId,
  courseTitle,
  open,
  onOpenChange,
  onCountChange,
}: {
  courseId: string;
  courseTitle: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCountChange?: (count: number) => void;
}) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Lesson | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoPublicId, setVideoPublicId] = useState("");
  const [isFree, setIsFree] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LessonInput>({ resolver: zodResolver(lessonSchema) });

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    api
      .get<{ course: unknown; lessons: Lesson[] }>(`/api/admin/courses/${courseId}`)
      .then((d) => setLessons(d.lessons))
      .catch((e) => toast.error("تعذّر جلب الدروس", (e as Error).message))
      .finally(() => setLoading(false));
  }, [open, courseId]);

  function openCreate() {
    setEditing(null);
    setVideoUrl("");
    setVideoPublicId("");
    setIsFree(false);
    reset({ course: courseId, title: "", order: lessons.length + 1, durationMinutes: 0 });
    setShowForm(true);
  }

  function openEdit(l: Lesson) {
    setEditing(l);
    setVideoUrl(l.videoUrl);
    setVideoPublicId(l.videoPublicId ?? "");
    setIsFree(l.isFree);
    reset({
      course: courseId,
      title: l.title,
      order: l.order,
      durationMinutes: l.durationMinutes,
    });
    setShowForm(true);
  }

  async function onSubmit(values: LessonInput) {
    try {
      const payload = { ...values, course: courseId, videoUrl, videoPublicId, isFree };
      let next: Lesson[];
      if (editing) {
        const updated = await api.put<Lesson>(`/api/admin/lessons/${editing._id}`, payload);
        next = lessons.map((x) => (x._id === editing._id ? updated : x));
        toast.success("تم تحديث الدرس");
      } else {
        const created = await api.post<Lesson>("/api/admin/lessons", payload);
        next = [...lessons, created];
        toast.success("تمت إضافة الدرس");
      }
      next.sort((a, b) => a.order - b.order);
      setLessons(next);
      onCountChange?.(next.length);
      setShowForm(false);
    } catch (err) {
      toast.error("تعذّر الحفظ", (err as Error).message);
    }
  }

  async function remove(id: string) {
    await api.del(`/api/admin/lessons/${id}`);
    const next = lessons.filter((x) => x._id !== id);
    setLessons(next);
    onCountChange?.(next.length);
    toast.success("تم حذف الدرس");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>دروس: {courseTitle}</DialogTitle>
        </DialogHeader>

        {showForm ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <MediaUpload
              folder="lessons"
              type="video"
              value={videoUrl}
              onChange={(url, pid) => {
                setVideoUrl(url);
                setVideoPublicId(pid);
              }}
              label="فيديو الدرس"
            />
            <div>
              <Label>عنوان الدرس</Label>
              <Input className="mt-1.5" {...register("title")} />
              <FieldError message={errors.title?.message} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>الترتيب</Label>
                <Input type="number" className="mt-1.5" {...register("order")} />
              </div>
              <div>
                <Label>المدة (دقائق)</Label>
                <Input type="number" className="mt-1.5" {...register("durationMinutes")} />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border p-3">
              <div>
                <Label>درس مجاني</Label>
                <p className="text-xs text-muted-foreground">يمكن لأي طالب مسجّل مشاهدته.</p>
              </div>
              <Switch checked={isFree} onCheckedChange={setIsFree} />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {editing ? "حفظ" : "إضافة الدرس"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                رجوع
              </Button>
            </div>
          </form>
        ) : (
          <div>
            <Button onClick={openCreate} className="mb-4 w-full">
              <Plus className="h-4 w-4" /> إضافة درس جديد
            </Button>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-maroon-600" />
              </div>
            ) : lessons.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                لا توجد دروس بعد.
              </p>
            ) : (
              <ul className="max-h-[50vh] space-y-2 overflow-y-auto">
                {lessons.map((l) => (
                  <li
                    key={l._id}
                    className="flex items-center gap-3 rounded-xl border border-border p-3"
                  >
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary text-xs font-bold text-maroon-700">
                      {l.order}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{l.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDuration(l.durationMinutes)}
                      </p>
                    </div>
                    {l.isFree ? (
                      <Badge variant="success" className="gap-1">
                        <Unlock className="h-3 w-3" /> مجاني
                      </Badge>
                    ) : l.videoUrl ? (
                      <PlayCircle className="h-4 w-4 text-maroon-600" />
                    ) : (
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    )}
                    <Button variant="ghost" size="icon" onClick={() => openEdit(l)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => remove(l._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
