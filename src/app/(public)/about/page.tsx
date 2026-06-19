import type { Metadata } from "next";
import { Target, Eye, Flag, CheckCircle2, Stethoscope } from "lucide-react";
import { getSettings } from "@/models/Settings";
import { SectionHeading } from "@/components/shared/section-heading";
import { LogoMark } from "@/components/brand/logo";

export const metadata: Metadata = { title: "من نحن" };
export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const settings = await getSettings();
  const { about } = settings;
  const goals = about?.goals?.length
    ? about.goals
    : [
        "إعداد ممارسين مؤهلين في الطب الصيني التقليدي.",
        "تقديم محتوى تعليمي أصيل وموثوق.",
        "اعتماد وتوثيق الشهادات بشكل قابل للتحقق.",
        "نشر الوعي بأهمية العلوم الصينية.",
      ];

  return (
    <div className="pb-10">
      <section className="brand-gradient py-16 text-center text-white">
        <div className="container flex flex-col items-center">
          <LogoMark size={72} light priority />
          <h1 className="mt-5 font-display text-4xl font-bold">
            مؤسسة النخبة للعلوم الصينية
          </h1>
          <p className="mt-3 max-w-2xl text-beige-100/85">
            {about?.intro ||
              "مؤسسة تعليمية متخصصة في نشر علوم الطب الصيني التقليدي بأسلوب أكاديمي احترافي."}
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container grid gap-6 md:grid-cols-2">
          <Panel icon={Eye} title="رؤيتنا" body={about?.vision || "أن نكون المرجع الرائد في تعليم الطب والعلوم الصينية في العالم العربي."} />
          <Panel icon={Target} title="رسالتنا" body={about?.mission || "تقديم تعليم عالي الجودة في الطب الصيني عبر نخبة من الخبراء ومحتوى عملي معتمد."} />
        </div>

        <div className="container mt-6">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-maroon-700">
                <Flag className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-maroon-900">أهداف المؤسسة</h3>
            </div>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {goals.map((g, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-maroon-600" />
                  {g}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="container mt-12">
          <SectionHeading
            eyebrow="مجالاتنا"
            title="نبذة عن التخصصات"
            description={about?.specialties || "نغطّي أبرز تخصصات الطب الصيني التقليدي بمناهج عملية متدرّجة."}
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {["الإبر الصينية", "الحجامة العلاجية", "الطب الصيني التقليدي", "التدليك الصيني", "الأعشاب الصينية", "العلاج بالطاقة"].map((s) => (
              <div key={s} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-5 shadow-soft">
                <Stethoscope className="h-6 w-6 text-maroon-600" />
                <span className="font-semibold text-maroon-900">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Panel({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-maroon-700">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 font-display text-xl font-bold text-maroon-900">{title}</h3>
      <p className="mt-2 leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}
