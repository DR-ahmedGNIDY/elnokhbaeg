import Link from "next/link";
import { BookOpen } from "lucide-react";
import { requireAuth } from "@/lib/session";
import { getUserEnrollments } from "@/lib/data/learn";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import {
  EnrolledCourseCard,
  type EnrolledCourse,
} from "@/components/dashboard/enrolled-course-card";

export const dynamic = "force-dynamic";

export default async function MyCoursesPage() {
  const user = await requireAuth("/dashboard/courses");
  const enrollments = (await getUserEnrollments(user.id)) as unknown as EnrolledCourse[];

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-maroon-900">دوراتي</h1>
      {enrollments.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="لم تشترك في أي دورة بعد"
          description="تصفّح الدورات المتاحة وابدأ رحلتك التعليمية."
          action={
            <Button asChild>
              <Link href="/courses">تصفّح الدورات</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {enrollments.map((e) => (
            <EnrolledCourseCard key={e._id} enrollment={e} />
          ))}
        </div>
      )}
    </div>
  );
}
