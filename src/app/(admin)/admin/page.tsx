import Link from "next/link";
import {
  Users,
  BookOpen,
  GraduationCap,
  BadgeCheck,
  Newspaper,
  UserCheck,
  ShoppingBag,
  ArrowLeft,
} from "lucide-react";
import { getAdminStats } from "@/lib/data/admin";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/shared/stat-card";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const s = await getAdminStats();

  const quickLinks = [
    { label: "إضافة دورة", href: "/admin/courses", icon: BookOpen },
    { label: "إضافة مقال", href: "/admin/articles", icon: Newspaper },
    { label: "إضافة محاضر", href: "/admin/instructors", icon: GraduationCap },
    { label: "إضافة طالب معتمد", href: "/admin/approved-students", icon: BadgeCheck },
  ];

  return (
    <div>
      <PageHeader
        title="لوحة التحكم"
        description="نظرة عامة على نشاط المؤسسة وإحصائياتها."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="إجمالي المستخدمين" value={s.totalUsers} icon={Users} />
        <StatCard label="الطلاب" value={s.students} icon={UserCheck} />
        <StatCard label="الدورات" value={s.courses} icon={BookOpen} />
        <StatCard label="الاشتراكات المدفوعة" value={s.enrollments} icon={ShoppingBag} />
        <StatCard label="المحاضرون" value={s.instructors} icon={GraduationCap} />
        <StatCard label="المقالات" value={s.articles} icon={Newspaper} />
        <StatCard label="الطلاب المعتمدون" value={s.approved} icon={BadgeCheck} />
        <StatCard label="حسابات Google" value={s.googleUsers} icon={Users} />
      </div>

      <div className="mt-8">
        <h2 className="mb-4 font-display text-lg font-bold text-maroon-900">
          إجراءات سريعة
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className="group flex items-center justify-between rounded-2xl border border-border bg-card p-5 shadow-soft transition hover:shadow-card"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-maroon-700">
                  <q.icon className="h-5 w-5" />
                </div>
                <span className="font-semibold text-maroon-900">{q.label}</span>
              </div>
              <ArrowLeft className="h-5 w-5 text-muted-foreground transition group-hover:-translate-x-1" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
