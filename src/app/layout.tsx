import type { Metadata, Viewport } from "next";
import { Cairo, El_Messiri } from "next/font/google";
import { Providers } from "@/components/providers";
import { SITE } from "@/lib/constants";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-arabic",
  display: "swap",
});

const elMessiri = El_Messiri({
  subsets: ["arabic", "latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | تعليم معتمد في الطب والعلوم الصينية`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "الطب الصيني",
    "العلوم الصينية",
    "الإبر الصينية",
    "الحجامة",
    "دورات معتمدة",
    "مؤسسة النخبة",
  ],
  authors: [{ name: SITE.name }],
  openGraph: {
    type: "website",
    locale: SITE.locale,
    siteName: SITE.name,
    title: SITE.name,
    description: SITE.description,
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: SITE.name,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: SITE.name,
    description: SITE.description,
    images: ["/icon-512.png"],
  },
  // favicon.ico / icon.png / apple-icon.png in src/app are auto-detected
  // by the App Router and injected as <link rel="icon"/apple-touch-icon>.
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#5a2828",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${elMessiri.variable}`}>
      <body className="min-h-screen bg-background font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
