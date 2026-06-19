"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Lock,
  PlayCircle,
  CheckCircle2,
  ShoppingCart,
  ListVideo,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api-client";
import { toast } from "@/store/toast";
import { cn, formatDuration } from "@/lib/utils";

interface Lesson {
  _id: string;
  title: string;
  videoUrl: string;
  durationMinutes: number;
  isFree: boolean;
  canView: boolean;
  order: number;
}

export function LessonPlayer({
  courseId,
  courseTitle,
  slug,
  lessons,
  isEnrolled,
  initialLessonId,
}: {
  courseId: string;
  courseTitle: string;
  slug: string;
  lessons: Lesson[];
  isEnrolled: boolean;
  initialLessonId?: string;
}) {
  const firstViewable = lessons.find((l) => l.canView) ?? lessons[0];
  const initial =
    lessons.find((l) => l._id === initialLessonId && l.canView) ?? firstViewable;
  const [activeId, setActiveId] = useState(initial?._id);
  const [enrolling, setEnrolling] = useState(false);

  const active = useMemo(
    () => lessons.find((l) => l._id === activeId),
    [lessons, activeId],
  );

  function selectLesson(l: Lesson) {
    if (!l.canView) {
      toast.error("هذا الدرس مغلق", "يجب شراء الدورة لمشاهدة هذا الدرس.");
      return;
    }
    setActiveId(l._id);
    api
      .post("/api/progress", { courseId, lessonId: l._id, completed: true })
      .catch(() => {});
  }

  async function handleEnroll() {
    try {
      setEnrolling(true);
      await api.post("/api/enroll", { courseId });
      toast.success("تم تفعيل اشتراكك", "أعد تحميل الصفحة لفتح جميع الدروس.");
      window.location.reload();
    } catch (err) {
      toast.error("تعذّر الاشتراك", (err as Error).message);
    } finally {
      setEnrolling(false);
    }
  }

  return (
    <div className="container grid gap-6 py-8 lg:grid-cols-[1.7fr_1fr]">
      {/* Player */}
      <div>
        <div className="overflow-hidden rounded-2xl border border-border bg-black">
          {active?.canView && active.videoUrl ? (
            <video
              key={active._id}
              src={active.videoUrl}
              controls
              controlsList="nodownload"
              className="aspect-video w-full bg-black"
            />
          ) : (
            <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 bg-maroon-950 text-beige-200">
              <Lock className="h-10 w-10" />
              <p className="text-sm">هذا الدرس مغلق — اشترِ الدورة لمشاهدته.</p>
            </div>
          )}
        </div>

        <div className="mt-5">
          <Link href={`/courses/${slug}`} className="text-sm text-maroon-600 hover:underline">
            {courseTitle}
          </Link>
          <h1 className="mt-1 font-display text-2xl font-bold text-maroon-900">
            {active?.title ?? "—"}
          </h1>
        </div>

        {!isEnrolled && (
          <div className="mt-6 flex flex-col items-start gap-3 rounded-2xl border border-beige-300 bg-beige-50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-maroon-900">افتح الدورة كاملة</p>
              <p className="text-sm text-muted-foreground">
                اشترِ الدورة لمشاهدة جميع الدروس والحصول على الشهادة.
              </p>
            </div>
            <Button onClick={handleEnroll} disabled={enrolling}>
              <ShoppingCart className="h-4 w-4" /> اشترِ الآن
            </Button>
          </div>
        )}
      </div>

      {/* Lesson list */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
          <div className="mb-3 flex items-center gap-2 px-2 text-maroon-900">
            <ListVideo className="h-5 w-5" />
            <h2 className="font-display font-bold">محتوى الدورة</h2>
            <span className="ms-auto text-xs text-muted-foreground">
              {lessons.length} درس
            </span>
          </div>
          <ul className="max-h-[70vh] space-y-1 overflow-y-auto">
            {lessons.map((l, idx) => {
              const isActive = l._id === activeId;
              return (
                <li key={l._id}>
                  <button
                    onClick={() => selectLesson(l)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl p-3 text-start transition",
                      isActive ? "bg-secondary" : "hover:bg-secondary/50",
                      !l.canView && "opacity-70",
                    )}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background text-xs font-bold text-maroon-700">
                      {idx + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {l.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDuration(l.durationMinutes)}
                      </p>
                    </div>
                    {l.isFree && !isEnrolled ? (
                      <Badge variant="success">مجاني</Badge>
                    ) : l.canView ? (
                      <PlayCircle className="h-4 w-4 text-maroon-600" />
                    ) : (
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
    </div>
  );
}
