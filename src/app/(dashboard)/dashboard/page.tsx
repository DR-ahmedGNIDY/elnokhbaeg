import Link from "next/link";
import Image from "next/image";
import { BookOpen, GraduationCap, TrendingUp, Mail } from "lucide-react";
import { requireAuth } from "@/lib/session";
import { getUserEnrollments } from "@/lib/data/learn";
import { getStudentProfile } from "@/lib/data/student";
import { StatCard } from "@/components/shared/stat-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import {
  EnrolledCourseCard,
  type EnrolledCourse,
} from "@/components/dashboard/enrolled-course-card";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const sessionUser = await requireAuth("/dashboard");
  const [profile, enrollmentsRaw] = await Promise.all([
    getStudentProfile(sessionUser.id),
    getUserEnrollments(sessionUser.id),
  ]);
  const enrollments = enrollmentsRaw as unknown as EnrolledCourse[];

  const name = profile?.name ?? sessionUser.name ?? "";
  const email = profile?.email ?? sessionUser.email ?? "";
  const avatar = profile?.avatar ?? sessionUser.image ?? null;
  const completed = enrollments.filter((e) => e.progress >= 100).length;
  const avgProgress = enrollments.length
    ? Math.round(enrollments.reduce((s, e) => s + e.progress, 0) / enrollments.length)
    : 0;

  const continueLearning = [...enrollments]
    .filter((e) => e.progress < 100)
    .sort((a, b) => b.progress - a.progress)[0];

  return (
    <div className="space-y-8">
      {/* Profile header */}
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft sm:flex-row sm:text-start">
        <div className="relative h-20 w-20 overflow-hidden rounded-full bg-secondary ring-4 ring-secondary">
          {avatar ? (
            <Image src={avatar} alt={name} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-3xl font-bold text-maroon-300">
              {name.charAt(0)}
            </div>
          )}
        </div>
        <div className="text-center sm:text-start">
          <h1 className="font-display text-2xl font-bold text-maroon-900">
            مرحباً، {name}
          </h1>
          <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-muted-foreground sm:justify-start" dir="ltr">
            <Mail className="h-4 w-4" /> {email}
          </p>
        </div>
        <Button asChild variant="outline" className="sm:ms-auto">
          <Link href="/dashboard/settings">إعدادات الحساب</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="دوراتي" value={enrollments.length} icon={BookOpen} />
        <StatCard label="الدورات المكتملة" value={completed} icon={GraduationCap} />
        <StatCard label="متوسط التقدّم" value={`${avgProgress}%`} icon={TrendingUp} />
      </div>

      {/* Continue learning */}
      {continueLearning && continueLearning.course && (
        <section>
          <h2 className="mb-4 font-display text-lg font-bold text-maroon-900">
            متابعة التعلّم
          </h2>
          <div className="sm:max-w-sm">
            <EnrolledCourseCard enrollment={continueLearning} />
          </div>
        </section>
      )}

      {/* My courses */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-maroon-900">دوراتي</h2>
          {enrollments.length > 0 && (
            <Button asChild variant="link" size="sm">
              <Link href="/dashboard/courses">عرض الكل</Link>
            </Button>
          )}
        </div>
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
            {enrollments.slice(0, 6).map((e) => (
              <EnrolledCourseCard key={e._id} enrollment={e} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
