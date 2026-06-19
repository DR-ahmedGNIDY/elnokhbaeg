import type { Metadata } from "next";
import { getPublishedCourses } from "@/lib/data/courses";
import { CourseCard } from "@/components/shared/course-card";
import { EmptyState } from "@/components/shared/empty-state";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "الدورات",
  description: "تصفّح جميع الدورات المعتمدة في الطب والعلوم الصينية.",
};
export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const courses = await getPublishedCourses();

  return (
    <div className="pb-16">
      <section className="brand-gradient py-14 text-center text-white">
        <div className="container">
          <h1 className="font-display text-4xl font-bold">الدورات التدريبية</h1>
          <p className="mt-3 text-beige-100/85">
            دورات معتمدة في الطب والعلوم الصينية يقدّمها نخبة من الخبراء.
          </p>
        </div>
      </section>

      <div className="container mt-12">
        {courses.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="لا توجد دورات متاحة حالياً"
            description="ستظهر الدورات هنا فور إضافتها من لوحة التحكم."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => (
              <CourseCard key={c._id} course={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
