import type { Metadata } from "next";
import { getActiveInstructors } from "@/lib/data/instructors";
import { InstructorCard } from "@/components/shared/instructor-card";
import { EmptyState } from "@/components/shared/empty-state";
import { GraduationCap } from "lucide-react";

export const metadata: Metadata = { title: "المحاضرون" };
export const dynamic = "force-dynamic";

export default async function InstructorsPage() {
  const instructors = (await getActiveInstructors()) as never as {
    _id: string;
    slug: string;
    name: string;
    title: string;
    shortBio: string;
    avatar?: string | null;
  }[];

  return (
    <div className="pb-16">
      <section className="brand-gradient py-14 text-center text-white">
        <div className="container">
          <h1 className="font-display text-4xl font-bold">نخبة المحاضرين</h1>
          <p className="mt-3 text-beige-100/85">خبراء متخصصون في الطب والعلوم الصينية.</p>
        </div>
      </section>

      <div className="container mt-12">
        {instructors.length === 0 ? (
          <EmptyState
            icon={GraduationCap}
            title="لا يوجد محاضرون بعد"
            description="سيتم عرض المحاضرين هنا فور إضافتهم من لوحة التحكم."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {instructors.map((i) => (
              <InstructorCard key={i._id} instructor={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
