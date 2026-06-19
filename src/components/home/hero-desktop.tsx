import Link from "next/link";
import { ShieldCheck, Award, Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/brand/logo";

export function HeroDesktop({ stats }: { stats: { courses: number; instructors: number; students: number } }) {
  return (
    <section className="relative hidden overflow-hidden lg:block">
      <div className="absolute inset-0 brand-gradient" />
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      <div className="container relative grid grid-cols-2 items-center gap-12 py-24">
        <div className="text-white">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-beige-200/30 bg-white/10 px-4 py-1.5 text-sm font-medium text-beige-100">
            <Sparkles className="h-4 w-4 text-beige-300" />
            مؤسسة تعليمية متخصصة في الطب والعلوم الصينية
          </span>
          <h1 className="font-display text-5xl font-bold leading-[1.15] text-balance">
            تعلّم العلوم الصينية على يد نخبة من الخبراء
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-beige-100/85">
            دورات احترافية معتمدة في الإبر الصينية، الحجامة، والطب الصيني التقليدي — بمحتوى عملي وشهادات موثقة قابلة للتحقق.
          </p>

          <div className="mt-9 flex items-center gap-4">
            <Button asChild size="lg" variant="gold">
              <Link href="/courses">
                تصفّح الدورات <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white">
              <Link href="/register">أنشئ حسابك مجاناً</Link>
            </Button>
          </div>

          <div className="mt-12 flex items-center gap-10">
            <Stat value={`${stats.courses}+`} label="دورة تدريبية" />
            <div className="h-10 w-px bg-white/20" />
            <Stat value={`${stats.instructors}+`} label="محاضر خبير" />
            <div className="h-10 w-px bg-white/20" />
            <Stat value={`${stats.students}+`} label="طالب وطالبة" />
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="relative flex h-[420px] w-[420px] items-center justify-center rounded-full border border-beige-200/20 bg-white/5 backdrop-blur">
            <div className="flex h-72 w-72 items-center justify-center rounded-full border border-beige-200/30 bg-white/10">
              <LogoMark size={150} light priority />
            </div>
            <FloatingBadge className="-top-2 start-6" icon={ShieldCheck} text="شهادات موثقة" />
            <FloatingBadge className="bottom-4 -end-2" icon={Award} text="اعتماد رسمي" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-3xl font-bold text-beige-200">{value}</p>
      <p className="text-sm text-beige-100/70">{label}</p>
    </div>
  );
}

function FloatingBadge({
  className,
  icon: Icon,
  text,
}: {
  className?: string;
  icon: React.ComponentType<{ className?: string }>;
  text: string;
}) {
  return (
    <div className={`absolute flex items-center gap-2 rounded-xl bg-card px-4 py-2.5 shadow-card ${className}`}>
      <Icon className="h-5 w-5 text-maroon-700" />
      <span className="text-sm font-semibold text-maroon-900">{text}</span>
    </div>
  );
}
