import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  PlayCircle,
  Lock,
  Unlock,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import { getCourseForLearner } from "@/lib/data/learn";
import { getCurrentUser } from "@/lib/session";
import { CourseCta } from "@/components/courses/course-cta";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDuration } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const user = await getCurrentUser();
  const data = await getCourseForLearner(slug, user?.id);
  if (!data) return { title: "الدورة غير موجودة" };
  return {
    title: data.course.title,
    description: data.course.shortDescription,
  };
}

export default async function CourseDetailsPage({ params }: Props) {
  const { slug } = await params;
  const user = await getCurrentUser();
  const data = await getCourseForLearner(slug, user?.id);
  if (!data) notFound();

  const { course, lessons, isEnrolled } = data;
  const instructor = course.instructor as
    | { name: string; title: string; avatar?: string | null; slug: string }
    | null;
  const freeLesson = lessons.find((l: { isFree: boolean }) => l.isFree);

  return (
    <div className="pb-16">
      {/* Hero */}
      <section className="brand-gradient py-12 text-white">
        <div className="container grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-center">
          <div>
            <Badge variant="gold" className="mb-4">
              {course.lessonsCount} درس
            </Badge>
            <h1 className="font-display text-3xl font-bold leading-tight md:text-4xl">
              {course.title}
            </h1>
            <p className="mt-4 max-w-2xl leading-relaxed text-beige-100/85">
              {course.shortDescription}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-beige-100/85">
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" /> {course.lessonsCount} درس
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> {formatDuration(course.durationMinutes)}
              </span>
              {instructor && (
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="h-4 w-4" /> {instructor.name}
                </span>
              )}
            </div>
          </div>

          <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/20 bg-black/20">
            {course.coverImage ? (
              <Image src={course.coverImage} alt={course.title} fill className="object-cover" priority />
            ) : (
              <div className="flex h-full items-center justify-center text-beige-200">
                <PlayCircle className="h-16 w-16" />
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="container mt-12 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        {/* Main */}
        <div className="space-y-10">
          <section>
            <h2 className="heading-display text-2xl">عن الدورة</h2>
            <div className="mt-4 whitespace-pre-line leading-relaxed text-foreground/80">
              {course.fullDescription || course.shortDescription}
            </div>
          </section>

          <section>
            <h2 className="heading-display text-2xl">محتوى الدورة</h2>
            <ul className="mt-5 space-y-2">
              {lessons.map(
                (
                  l: { _id: string; title: string; isFree: boolean; durationMinutes: number; canView: boolean },
                  idx: number,
                ) => {
                  const unlocked = isEnrolled || l.isFree;
                  return (
                    <li
                      key={l._id}
                      className="flex items-center justify-between rounded-xl border border-border bg-card p-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-sm font-bold text-maroon-700">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-medium text-foreground">{l.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDuration(l.durationMinutes)}
                          </p>
                        </div>
                      </div>
                      {l.isFree ? (
                        <Badge variant="success" className="gap-1">
                          <Unlock className="h-3 w-3" /> مجاني
                        </Badge>
                      ) : unlocked ? (
                        <Unlock className="h-4 w-4 text-maroon-600" />
                      ) : (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      )}
                    </li>
                  );
                },
              )}
              {lessons.length === 0 && (
                <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  لم تُضف دروس لهذه الدورة بعد.
                </p>
              )}
            </ul>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <p className="font-display text-3xl font-bold text-maroon-800">
              {formatPrice(course.price)}
            </p>
            <div className="mt-5">
              <CourseCta
                courseId={course._id}
                slug={course.slug}
                price={course.price}
                isEnrolled={isEnrolled}
                freeLessonId={freeLesson?._id ?? null}
              />
            </div>

            {instructor && (
              <Link
                href={`/instructors/${instructor.slug}`}
                className="mt-6 flex items-center gap-3 rounded-xl border border-border p-3 transition hover:bg-secondary/50"
              >
                <div className="relative h-12 w-12 overflow-hidden rounded-full bg-secondary">
                  {instructor.avatar ? (
                    <Image src={instructor.avatar} alt={instructor.name} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-maroon-400">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">المحاضر</p>
                  <p className="font-semibold text-maroon-900">{instructor.name}</p>
                </div>
              </Link>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
