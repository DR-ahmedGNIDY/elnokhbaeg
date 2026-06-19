import Link from "next/link";
import { ShieldCheck, Award, GraduationCap } from "lucide-react";
import { Logo, LogoMark } from "@/components/brand/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel (desktop) */}
      <div className="relative hidden flex-col justify-between overflow-hidden brand-gradient p-12 text-white lg:flex">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, #fff 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
        <Logo variant="light" />
        <div className="relative">
          <LogoMark size={90} light priority />
          <h2 className="mt-6 font-display text-3xl font-bold leading-tight">
            بوابتك إلى تعلّم العلوم الصينية
          </h2>
          <p className="mt-3 max-w-md text-beige-100/80">
            انضم إلى مجتمع النخبة، تابع دوراتك المعتمدة، واحصل على شهادات موثقة.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-beige-100/85">
            <Feature icon={ShieldCheck} text="حساب آمن وتسجيل دخول موثوق" />
            <Feature icon={GraduationCap} text="وصول دائم لدوراتك المشتراة" />
            <Feature icon={Award} text="شهادات معتمدة قابلة للتحقق" />
          </ul>
        </div>
        <p className="relative text-xs text-beige-100/60">
          © {new Date().getFullYear()} مؤسسة النخبة للعلوم الصينية
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-col items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center lg:hidden">
            <Link href="/">
              <Logo />
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

function Feature({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
}) {
  return (
    <li className="flex items-center gap-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
        <Icon className="h-5 w-5 text-beige-200" />
      </span>
      {text}
    </li>
  );
}
