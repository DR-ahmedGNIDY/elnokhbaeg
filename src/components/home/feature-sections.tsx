import Link from "next/link";
import {
  ShieldCheck,
  GraduationCap,
  BadgeCheck,
  Clock,
  Users,
  BookOpen,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";

const REASONS = [
  {
    icon: BadgeCheck,
    title: "شهادات معتمدة وموثقة",
    desc: "كل شهادة تحمل كوداً فريداً يمكن التحقق منه عبر الموقع في أي وقت.",
  },
  {
    icon: GraduationCap,
    title: "نخبة من المحاضرين",
    desc: "خبراء متخصصون في الطب الصيني بسنوات خبرة عملية وأكاديمية.",
  },
  {
    icon: BookOpen,
    title: "محتوى عملي متدرّج",
    desc: "دروس مصوّرة عالية الجودة مرتبة بشكل احترافي يسهّل التعلّم.",
  },
  {
    icon: Clock,
    title: "تعلّم بالوتيرة المناسبة",
    desc: "وصول دائم لدوراتك مع متابعة تقدّمك ومواصلة التعلّم من حيث توقفت.",
  },
  {
    icon: ShieldCheck,
    title: "بيئة آمنة وموثوقة",
    desc: "حماية لحساباتك وبياناتك مع تسجيل دخول آمن عبر البريد أو Google.",
  },
  {
    icon: Award,
    title: "تخصص دقيق",
    desc: "مناهج مبنية على أصول الطب الصيني التقليدي وممارساته المعتمدة.",
  },
];

export function WhyUs() {
  return (
    <section className="section-pad bg-secondary/40">
      <div className="container">
        <SectionHeading
          eyebrow="لماذا النخبة؟"
          title="لماذا تختار مؤسسة النخبة"
          description="نقدّم تجربة تعليمية متكاملة تجمع بين الأصالة العلمية والجودة الاحترافية."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((r) => (
            <div
              key={r.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-soft transition hover:shadow-card"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-maroon-700">
                <r.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-maroon-900">
                {r.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {r.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function StatsSection({
  stats,
}: {
  stats: { students: number; courses: number; instructors: number; certificates: number };
}) {
  const items = [
    { icon: Users, label: "طالب وطالبة", value: stats.students },
    { icon: BookOpen, label: "دورة تدريبية", value: stats.courses },
    { icon: GraduationCap, label: "محاضر خبير", value: stats.instructors },
    { icon: Award, label: "شهادة معتمدة", value: stats.certificates },
  ];
  return (
    <section className="bg-maroon-900 py-14 text-white">
      <div className="container grid grid-cols-2 gap-8 lg:grid-cols-4">
        {items.map((it) => (
          <div key={it.label} className="flex flex-col items-center text-center">
            <it.icon className="h-8 w-8 text-beige-300" />
            <p className="mt-3 font-display text-3xl font-bold text-beige-100">
              {it.value}
              <span className="text-beige-300">+</span>
            </p>
            <p className="text-sm text-beige-100/75">{it.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CtaSection() {
  return (
    <section className="section-pad">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl brand-gradient px-8 py-14 text-center text-white md:px-16">
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            ابدأ رحلتك في الطب الصيني اليوم
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-beige-100/85">
            انضم إلى مجتمع النخبة واحصل على دورات معتمدة وشهادات موثقة تفتح لك آفاقاً جديدة.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" variant="gold">
              <Link href="/register">سجّل الآن مجاناً</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white">
              <Link href="/contact">تواصل معنا</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
