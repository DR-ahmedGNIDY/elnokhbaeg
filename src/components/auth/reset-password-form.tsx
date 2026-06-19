"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/shared/field-error";
import { resetPasswordSchema } from "@/lib/validations/auth";
import { api } from "@/lib/api-client";
import { toast } from "@/store/toast";
import { z } from "zod";

type Values = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") ?? "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token },
  });

  async function onSubmit(values: Values) {
    try {
      await api.post("/api/reset-password", values);
      toast.success("تم تحديث كلمة المرور", "يمكنك الآن تسجيل الدخول.");
      router.push("/login");
    } catch (err) {
      toast.error("تعذّر إعادة التعيين", (err as Error).message);
    }
  }

  if (!token) {
    return (
      <div className="text-center">
        <h1 className="font-display text-2xl font-bold text-maroon-900">رابط غير صالح</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          الرابط غير مكتمل أو منتهي الصلاحية.
        </p>
        <Button asChild className="mt-6">
          <Link href="/forgot-password">طلب رابط جديد</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-maroon-900">
        إعادة تعيين كلمة المرور
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">اختر كلمة مرور جديدة لحسابك.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <input type="hidden" {...register("token")} />
        <div>
          <Label htmlFor="password">كلمة المرور الجديدة</Label>
          <Input id="password" type="password" className="mt-1.5" {...register("password")} />
          <FieldError message={errors.password?.message} />
        </div>
        <div>
          <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
          <Input id="confirmPassword" type="password" className="mt-1.5" {...register("confirmPassword")} />
          <FieldError message={errors.confirmPassword?.message} />
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          تحديث كلمة المرور
        </Button>
      </form>
    </div>
  );
}
