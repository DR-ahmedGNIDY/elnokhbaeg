import { notFound } from "next/navigation";
import { getCourseForLearner } from "@/lib/data/learn";
import { requireAuth } from "@/lib/session";
import { LessonPlayer } from "@/components/learn/lesson-player";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lesson?: string }>;
}

export default async function LearnPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { lesson } = await searchParams;
  const user = await requireAuth(`/learn/${slug}`);

  const data = await getCourseForLearner(slug, user.id);
  if (!data) notFound();

  const { course, lessons, isEnrolled } = data;

  return (
    <LessonPlayer
      courseId={course._id}
      courseTitle={course.title}
      slug={course.slug}
      lessons={lessons}
      isEnrolled={isEnrolled}
      initialLessonId={lesson}
    />
  );
}
