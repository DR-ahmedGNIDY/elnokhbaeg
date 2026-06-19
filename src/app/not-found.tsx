import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/brand/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary/30 px-5 text-center">
      <LogoMark size={72} />
      <h1 className="mt-6 font-display text-5xl font-bold text-maroon-900">404</h1>
      <p className="mt-2 text-lg text-muted-foreground">
        عذراً، الصفحة التي تبحث عنها غير موجودة.
      </p>
      <Button asChild className="mt-6">
        <Link href="/">العودة إلى الرئيسية</Link>
      </Button>
    </div>
  );
}
