import Link from "next/link";
import Image from "next/image";
import { Clock, PlayCircle, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDuration } from "@/lib/utils";
import type { CourseDTO } from "@/lib/data/courses";

export function CourseCard({ course }: { course: CourseDTO }) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all hover:-translate-y-1 hover:shadow-card"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
        {course.coverImage ? (
          <Image
            src={course.coverImage}
            alt={course.title}
            fill
            sizes="(max-width:768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-maroon-300">
            <PlayCircle className="h-12 w-12" />
          </div>
        )}
        {course.isFeatured && (
          <Badge variant="gold" className="absolute end-3 top-3 shadow">
            مميزة
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold text-maroon-900 line-clamp-2">
          {course.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-2">
          {course.shortDescription}
        </p>

        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <PlayCircle className="h-4 w-4" /> {course.lessonsCount} درس
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" /> {formatDuration(course.durationMinutes)}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <span className="font-display text-lg font-bold text-maroon-700">
            {formatPrice(course.price)}
          </span>
          <span className="flex items-center gap-1 text-sm font-semibold text-maroon-600 transition-transform group-hover:-translate-x-1">
            التفاصيل <ArrowLeft className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
