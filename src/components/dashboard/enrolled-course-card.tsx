import Link from "next/link";
import Image from "next/image";
import { PlayCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface EnrolledCourse {
  _id: string;
  progress: number;
  course: {
    _id: string;
    title: string;
    slug: string;
    coverImage?: string | null;
    shortDescription: string;
    lessonsCount: number;
  } | null;
}

export function EnrolledCourseCard({ enrollment }: { enrollment: EnrolledCourse }) {
  const course = enrollment.course;
  if (!course) return null;
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      <div className="relative aspect-[16/9] bg-secondary">
        {course.coverImage ? (
          <Image src={course.coverImage} alt={course.title} fill className="object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full items-center justify-center text-maroon-300">
            <BookOpen className="h-10 w-10" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold text-maroon-900 line-clamp-1">
          {course.title}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">{course.lessonsCount} درس</p>

        <div className="mt-4">
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">نسبة الإكمال</span>
            <span className="font-semibold text-maroon-700">{enrollment.progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${enrollment.progress}%` }}
            />
          </div>
        </div>

        <Button asChild className="mt-4">
          <Link href={`/learn/${course.slug}`}>
            <PlayCircle className="h-4 w-4" /> متابعة التعلّم
          </Link>
        </Button>
      </div>
    </div>
  );
}
