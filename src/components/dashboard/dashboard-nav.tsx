"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "لوحتي", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { label: "دوراتي", href: "/dashboard/courses", icon: BookOpen },
  { label: "إعدادات الحساب", href: "/dashboard/settings", icon: Settings },
];

export function DashboardNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto rounded-2xl border border-border bg-card p-1.5 no-scrollbar">
      {NAV.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors",
              active
                ? "bg-primary text-primary-foreground shadow-soft"
                : "text-foreground/70 hover:bg-secondary",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
