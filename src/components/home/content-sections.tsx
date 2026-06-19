import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { CourseCard } from "@/components/shared/course-card";
import { InstructorCard } from "@/components/shared/instructor-card";
import { ArticleCard } from "@/components/shared/article-card";
import { EmptyState } from "@/components/shared/empty-state";
import type { CourseDTO } from "@/lib/data/courses";

function ViewAll({ href, label }: { href: string; label: string }) {
  return (
    <div className="mt-10 text-center">
      <Button asChild variant="outline">
        <Link href={href}>
          {label} <ArrowLeft className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}

export function FeaturedCourses({ courses }: { courses: CourseDTO[] }) {
  return (
    <section className="section-pad">
      <div className="container">
        <SectionHeading
          eyebrow="الأكثر طلباً"
          title="الدورات المميزة"
          description="نخبة من أفضل دوراتنا المعتمدة، مختارة بعناية لتبدأ بها رحلتك."
        />
        {courses.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              title="لا توجد دورات مميزة بعد"
              description="سيتم عرض الدورات المميزة هنا فور إضافتها من لوحة التحكم."
            />
          </div>
        ) : (
          <>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((c) => (
                <CourseCard key={c._id} course={c} />
              ))}
            </div>
            <ViewAll href="/courses" label="عرض جميع الدورات" />
          </>
        )}
      </div>
    </section>
  );
}

export function InstructorsPreview({
  instructors,
}: {
  instructors: { _id: string; slug: string; name: string; title: string; shortBio: string; avatar?: string | null }[];
}) {
  if (instructors.length === 0) return null;
  return (
    <section className="section-pad bg-secondary/40">
      <div className="container">
        <SectionHeading
          eyebrow="فريقنا"
          title="نخبة المحاضرين"
          description="خبراء متخصصون يرافقونك في كل خطوة من رحلتك التعليمية."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {instructors.slice(0, 4).map((i) => (
            <InstructorCard key={i._id} instructor={i} />
          ))}
        </div>
        <ViewAll href="/instructors" label="عرض جميع المحاضرين" />
      </div>
    </section>
  );
}

export function ArticlesPreview({
  articles,
}: {
  articles: { _id: string; slug: string; title: string; excerpt?: string; image?: string | null; publishedAt: string }[];
}) {
  if (articles.length === 0) return null;
  return (
    <section className="section-pad">
      <div className="container">
        <SectionHeading
          eyebrow="من مدوّنتنا"
          title="أحدث المقالات"
          description="مقالات ومعرفة في عالم الطب والعلوم الصينية."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.slice(0, 3).map((a) => (
            <ArticleCard key={a._id} article={a} />
          ))}
        </div>
        <ViewAll href="/articles" label="عرض جميع المقالات" />
      </div>
    </section>
  );
}

export function AboutBrief({ intro }: { intro?: string }) {
  return (
    <section className="section-pad">
      <div className="container">
        <div className="grid items-center gap-10 rounded-3xl border border-border bg-card p-8 shadow-soft md:grid-cols-2 md:p-12">
          <div>
            <span className="mb-3 inline-block rounded-full bg-secondary px-4 py-1 text-xs font-bold text-maroon-700">
              من نحن
            </span>
            <h2 className="heading-display text-3xl">مؤسسة النخبة للعلوم الصينية</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              {intro ||
                "مؤسسة تعليمية متخصصة تهدف إلى نشر علوم الطب الصيني التقليدي بأسلوب أكاديمي احترافي، عبر دورات معتمدة يقدّمها نخبة من الخبراء، وشهادات موثقة قابلة للتحقق."}
            </p>
            <Button asChild className="mt-6">
              <Link href="/about">
                تعرّف علينا أكثر <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { t: "رؤيتنا", d: "الريادة في تعليم الطب الصيني بالعالم العربي." },
              { t: "رسالتنا", d: "محتوى أصيل وجودة احترافية لكل متعلّم." },
              { t: "قيمنا", d: "الأصالة، الإتقان، والموثوقية." },
              { t: "هدفنا", d: "إعداد ممارسين مؤهلين ومعتمدين." },
            ].map((b) => (
              <div key={b.t} className="rounded-xl bg-secondary/60 p-4">
                <h4 className="font-display font-bold text-maroon-800">{b.t}</h4>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {b.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
