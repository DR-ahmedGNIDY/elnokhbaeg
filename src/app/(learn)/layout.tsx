import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Logo />
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard">
              <Home className="h-4 w-4" /> لوحتي
            </Link>
          </Button>
        </div>
      </header>
      {children}
    </div>
  );
}
