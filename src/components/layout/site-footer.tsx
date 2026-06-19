import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { PUBLIC_NAV, SITE } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-maroon-900/20 bg-maroon-950 text-beige-100">
      <div className="container grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo variant="light" />
          <p className="text-sm leading-relaxed text-beige-200/80">
            {SITE.description}
          </p>
        </div>

        <div>
          <h3 className="mb-4 font-display text-base font-bold text-white">
            روابط سريعة
          </h3>
          <ul className="space-y-2 text-sm">
            {PUBLIC_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-beige-200/80 transition-colors hover:text-beige-100"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-display text-base font-bold text-white">
            حسابي
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/login" className="text-beige-200/80 hover:text-beige-100">
                تسجيل الدخول
              </Link>
            </li>
            <li>
              <Link href="/register" className="text-beige-200/80 hover:text-beige-100">
                إنشاء حساب
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="text-beige-200/80 hover:text-beige-100">
                لوحة الطالب
              </Link>
            </li>
            <li>
              <Link href="/verify" className="text-beige-200/80 hover:text-beige-100">
                التحقق من الاعتماد
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-display text-base font-bold text-white">
            تواصل معنا
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2 text-beige-200/80">
              <Phone className="h-4 w-4 text-beige-400" /> {SITE.phone}
            </li>
            <li className="flex items-center gap-2 text-beige-200/80">
              <Mail className="h-4 w-4 text-beige-400" /> {SITE.email}
            </li>
            <li className="flex items-center gap-2 text-beige-200/80">
              <MapPin className="h-4 w-4 text-beige-400" /> {SITE.address}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container flex flex-col items-center justify-between gap-2 py-5 text-xs text-beige-200/70 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE.name}. جميع الحقوق محفوظة.
          </p>
          <p>صُمم بعناية لخدمة العلوم والطب الصيني.</p>
        </div>
      </div>
    </footer>
  );
}
