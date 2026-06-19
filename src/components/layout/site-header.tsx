"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Menu, LogOut, LayoutDashboard, User as UserIcon, Shield } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { PUBLIC_NAV, ROLES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {PUBLIC_NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-secondary text-maroon-900"
                    : "text-foreground/70 hover:bg-secondary/60 hover:text-maroon-800",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {status === "loading" ? (
            <div className="h-9 w-20 animate-pulse rounded-lg bg-secondary" />
          ) : user ? (
            <UserMenu
              name={user.name ?? ""}
              email={user.email ?? ""}
              image={user.image ?? undefined}
              role={user.role}
            />
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">تسجيل الدخول</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">إنشاء حساب</Link>
              </Button>
            </div>
          )}

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">القائمة</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="gap-0">
              <Logo className="mb-6" />
              <nav className="flex flex-col gap-1">
                {PUBLIC_NAV.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className="rounded-lg px-3 py-3 text-sm font-medium hover:bg-secondary"
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              {!user && (
                <div className="mt-6 flex flex-col gap-2">
                  <SheetClose asChild>
                    <Button asChild>
                      <Link href="/register">إنشاء حساب</Link>
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button asChild variant="outline">
                      <Link href="/login">تسجيل الدخول</Link>
                    </Button>
                  </SheetClose>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function UserMenu({
  name,
  email,
  image,
  role,
}: {
  name: string;
  email: string;
  image?: string;
  role?: string;
}) {
  const initials = name?.trim()?.charAt(0) || "؟";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-ring">
          <Avatar>
            <AvatarImage src={image} alt={name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">{name}</span>
            <span className="truncate text-xs text-muted-foreground">{email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {role === ROLES.ADMIN && (
          <DropdownMenuItem asChild>
            <Link href="/admin">
              <Shield /> لوحة الإدارة
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link href="/dashboard">
            <LayoutDashboard /> لوحتي
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings">
            <UserIcon /> إعدادات الحساب
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-destructive focus:bg-red-50"
        >
          <LogOut /> تسجيل الخروج
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
