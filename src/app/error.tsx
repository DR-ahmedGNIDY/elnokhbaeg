"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/brand/logo";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-secondary/30 px-5 text-center">
      <LogoMark size={64} />
      <h1 className="font-display text-2xl font-bold text-maroon-900">
        حدث خطأ غير متوقع
      </h1>
      <p className="max-w-md text-sm text-muted-foreground">
        نعتذر، حدث خطأ أثناء تحميل هذه الصفحة. يمكنك المحاولة مرة أخرى.
      </p>
      <Button onClick={reset}>إعادة المحاولة</Button>
    </div>
  );
}
