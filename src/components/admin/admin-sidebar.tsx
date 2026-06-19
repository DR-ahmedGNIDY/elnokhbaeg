"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  BookOpen,
  Newspaper,
  GraduationCap,
  Users,
  BadgeCheck,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "نظرة عامة", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "الدورات", href: "/admin/courses", icon: BookOpen },
  { label: "المقالات", href: "/admin/articles", icon: Newspaper },
  { label: "المحاضرون", href: "/admin/instructors", icon: GraduationCap },
  { label: "المستخدمون", href: "/admin/users", icon: Users },
  { label: "الطلاب المعتمدون", href: "/admin/approved-students", icon: BadgeCheck },
  { label: "الإعدادات", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-e border-border bg-card lg:flex">
      <div className="border-b border-border p-5">
        <Logo />
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {NAV.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-foreground/70 hover:bg-secondary",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-1 border-t border-border p-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/70 hover:bg-secondary"
        >
          <ExternalLink className="h-5 w-5" /> عرض الموقع
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive hover:bg-red-50"
        >
          <LogOut className="h-5 w-5" /> تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}

export function AdminMobileNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-border bg-card p-2 no-scrollbar lg:hidden">
      {NAV.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium",
              active ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:bg-secondary",
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
