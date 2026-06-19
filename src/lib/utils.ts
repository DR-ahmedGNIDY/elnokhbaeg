import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const EGP = new Intl.NumberFormat("ar-EG", {
  style: "currency",
  currency: "EGP",
  maximumFractionDigits: 0,
});

export function formatPrice(value: number): string {
  if (!value || value <= 0) return "مجاناً";
  return EGP.format(value);
}

const dateFmt = new Intl.DateTimeFormat("ar-EG", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export function formatDate(value: Date | string | number): string {
  return dateFmt.format(new Date(value));
}

export function formatDuration(minutes: number): string {
  if (!minutes) return "—";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h && m) return `${h} س ${m} د`;
  if (h) return `${h} ساعة`;
  return `${m} دقيقة`;
}

/** Arabic-friendly slug; falls back to a timestamp suffix to keep uniqueness. */
export function slugify(input: string): string {
  const base = input
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^؀-ۿa-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return base || `item-${Date.now().toString(36)}`;
}

export function truncate(text: string, max = 140): string {
  if (!text) return "";
  return text.length > max ? `${text.slice(0, max).trim()}…` : text;
}
