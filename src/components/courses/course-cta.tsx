"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, PlayCircle, ShoppingCart, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-client";
import { toast } from "@/store/toast";
import { formatPrice } from "@/lib/utils";

export function CourseCta({
  courseId,
  slug,
  price,
  isEnrolled,
  freeLessonId,
}: {
  courseId: string;
  slug: string;
  price: number;
  isEnrolled: boolean;
  freeLessonId?: string | null;
}) {
  const router = useRouter();
  const { status } = useSession();
  const [loading, setLoading] = useState(false);

  function requireLogin(next: string) {
    router.push(`/login?callbackUrl=${encodeURIComponent(next)}`);
  }

  async function handleEnroll() {
    if (status !== "authenticated") return requireLogin(`/courses/${slug}`);
    try {
      setLoading(true);
      await api.post("/api/enroll", { courseId });
      toast.success("تم تفعيل اشتراكك في الدورة");
      router.push(`/learn/${slug}`);
      router.refresh();
    } catch (err) {
      toast.error("تعذّر إتمام العملية", (err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function handleWatchFree() {
    const next = `/learn/${slug}${freeLessonId ? `?lesson=${freeLessonId}` : ""}`;
    if (status !== "authenticated") return requireLogin(next);
    router.push(next);
  }

  if (isEnrolled) {
    return (
      <Button size="lg" className="w-full" onClick={() => router.push(`/learn/${slug}`)}>
        <PlayCircle className="h-5 w-5" /> متابعة التعلّم
      </Button>
    );
  }

  return (
    <div className="space-y-3">
      <Button size="lg" className="w-full" onClick={handleEnroll} disabled={loading}>
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <ShoppingCart className="h-5 w-5" />
        )}
        {price > 0 ? `اشترِ الدورة — ${formatPrice(price)}` : "اشترك مجاناً"}
      </Button>
      {freeLessonId && (
        <Button size="lg" variant="outline" className="w-full" onClick={handleWatchFree}>
          <PlayCircle className="h-5 w-5" /> شاهد الدرس المجاني
        </Button>
      )}
      <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <CheckCircle2 className="h-4 w-4 text-maroon-600" /> وصول دائم + شهادة عند الإتمام
      </p>
    </div>
  );
}
