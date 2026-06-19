import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/brand/logo";

/** Mobile-first hero — condensed copy, prominent CTAs, then visual. */
export function HeroMobile() {
  return (
    <section className="relative overflow-hidden brand-gradient px-5 pb-10 pt-10 text-white lg:hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, #fff 1px, transparent 1px)", backgroundSize: "26px 26px" }} />
      <div className="relative text-center">
        <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-beige-100">
          <Sparkles className="h-3.5 w-3.5 text-beige-300" /> الطب والعلوم الصينية
        </span>
        <h1 className="font-display text-3xl font-bold leading-tight text-balance">
          تعلّم العلوم الصينية على يد نخبة الخبراء
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-beige-100/85">
          دورات معتمدة وشهادات موثقة قابلة للتحقق.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <Button asChild size="lg" variant="gold" className="w-full">
            <Link href="/register">أنشئ حسابك مجاناً</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white">
            <Link href="/login">تسجيل الدخول</Link>
          </Button>
        </div>

        <div className="mt-8 flex justify-center">
          <div className="flex h-32 w-32 items-center justify-center rounded-full border border-beige-200/30 bg-white/10">
            <LogoMark size={84} light priority />
          </div>
        </div>
      </div>
    </section>
  );
}
