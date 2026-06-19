import type { Metadata } from "next";
import { VerifyClient } from "@/components/verify/verify-client";
import { LogoMark } from "@/components/brand/logo";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "التحقق من الاعتماد",
  description: "تحقّق من صحة شهادات واعتمادات مؤسسة النخبة باستخدام كود الاعتماد.",
};

export default function VerifyPage() {
  return (
    <div className="pb-20">
      <section className="brand-gradient py-16 text-center text-white">
        <div className="container flex flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
            <ShieldCheck className="h-8 w-8 text-beige-200" />
          </div>
          <h1 className="mt-5 font-display text-4xl font-bold">التحقق من الاعتماد</h1>
          <p className="mt-3 max-w-xl text-beige-100/85">
            أدخل كود الاعتماد الخاص بالشهادة للتحقق من صحتها وبياناتها. مثال على الكود:
            <span className="mx-1 rounded bg-white/15 px-2 py-0.5 font-mono">NOK00001</span>
          </p>
        </div>
      </section>

      <div className="container mt-[-2rem] flex flex-col items-center">
        <div className="w-full max-w-xl">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="mb-4 flex items-center gap-2">
              <LogoMark size={36} />
              <span className="font-display font-bold text-maroon-900">
                نظام التحقق من الشهادات
              </span>
            </div>
            <VerifyClient />
          </div>
        </div>
      </div>
    </div>
  );
}
