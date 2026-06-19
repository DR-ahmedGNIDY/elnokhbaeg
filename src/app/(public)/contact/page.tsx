import type { Metadata } from "next";
import { Phone, Mail, MapPin } from "lucide-react";
import { getSettings } from "@/models/Settings";
import { SITE } from "@/lib/constants";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = { title: "تواصل معنا" };
export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await getSettings();
  const c = settings.contact;
  const phone = c?.phone || SITE.phone;
  const email = c?.email || SITE.email;
  const address = c?.address || SITE.address;

  return (
    <div className="pb-16">
      <section className="brand-gradient py-14 text-center text-white">
        <div className="container">
          <h1 className="font-display text-4xl font-bold">تواصل معنا</h1>
          <p className="mt-3 text-beige-100/85">
            نسعد بتواصلك معنا للاستفسار عن الدورات والاعتمادات.
          </p>
        </div>
      </section>

      <div className="container mt-12 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4">
          <InfoCard icon={Phone} label="الهاتف" value={phone} dir="ltr" />
          <InfoCard icon={Mail} label="البريد الإلكتروني" value={email} dir="ltr" />
          <InfoCard icon={MapPin} label="العنوان" value={address} />

          {c?.mapEmbedUrl ? (
            <div className="overflow-hidden rounded-2xl border border-border">
              <iframe
                src={c.mapEmbedUrl}
                className="h-64 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="الموقع على الخريطة"
              />
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-border bg-secondary/40 text-sm text-muted-foreground">
              سيتم عرض الخريطة هنا عند إضافتها من لوحة التحكم.
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft md:p-8">
          <h2 className="heading-display text-2xl">أرسل لنا رسالة</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            املأ النموذج وسنعاود التواصل معك في أقرب وقت.
          </p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
  dir,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  dir?: "ltr" | "rtl";
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-maroon-700">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-semibold text-maroon-900" dir={dir}>
          {value}
        </p>
      </div>
    </div>
  );
}
