export const SITE = {
  name: "مؤسسة النخبة للعلوم الصينية",
  shortName: "النخبة",
  description:
    "مؤسسة تعليمية متخصصة في العلوم والطب الصيني — دورات معتمدة، محاضرون خبراء، وشهادات موثقة.",
  url: process.env.AUTH_URL ?? "http://localhost:3000",
  locale: "ar_EG",
  phone: "+20 100 000 0000",
  email: "info@elite-cs.com",
  address: "القاهرة، جمهورية مصر العربية",
} as const;

export const ROLES = {
  ADMIN: "admin",
  STUDENT: "student",
} as const;
export type Role = (typeof ROLES)[keyof typeof ROLES];

export const USER_STATUS = {
  ACTIVE: "active",
  SUSPENDED: "suspended",
  BLOCKED: "blocked",
} as const;
export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  active: "نشط",
  suspended: "موقوف",
  blocked: "محظور",
};

export const AUTH_PROVIDERS = {
  CREDENTIALS: "credentials",
  GOOGLE: "google",
} as const;
export type AuthProvider =
  (typeof AUTH_PROVIDERS)[keyof typeof AUTH_PROVIDERS];

export const PROVIDER_LABELS: Record<string, string> = {
  credentials: "البريد الإلكتروني",
  google: "Google",
};

export const PAYMENT_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
} as const;
export type PaymentStatus =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export const CODE_PREFIX = "NOK";

export const PUBLIC_NAV = [
  { label: "الرئيسية", href: "/" },
  { label: "من نحن", href: "/about" },
  { label: "الدورات", href: "/courses" },
  { label: "المحاضرون", href: "/instructors" },
  { label: "المقالات", href: "/articles" },
  { label: "التحقق من الاعتماد", href: "/verify" },
  { label: "تواصل معنا", href: "/contact" },
] as const;
