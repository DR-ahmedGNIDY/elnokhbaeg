"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MailCheck, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/shared/field-error";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { api } from "@/lib/api-client";
import { z } from "zod";

type Values = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(forgotPasswordSchema) });

  async function onSubmit(values: Values) {
    await api.post("/api/forgot-password", values).catch(() => {});
    setSent(true);
  }

  if (sent) {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-maroon-700">
          <MailCheck className="h-7 w-7" />
        </div>
        <h1 className="mt-5 font-display text-2xl font-bold text-maroon-900">
          تحقّق من بريدك
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          إذا كان البريد مسجلاً لدينا، فستصلك رسالة تحتوي على رابط إعادة تعيين كلمة المرور.
        </p>
        <Button asChild variant="outline" className="mt-6">
          <Link href="/login">
            <ArrowRight className="h-4 w-4" /> العودة لتسجيل الدخول
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-maroon-900">نسيت كلمة المرور؟</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input id="email" type="email" dir="ltr" className="mt-1.5" {...register("email")} />
          <FieldError message={errors.email?.message} />
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          إرسال رابط إعادة التعيين
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link href="/login" className="font-semibold text-maroon-700 hover:underline">
          العودة لتسجيل الدخول
        </Link>
      </p>
    </div>
  );
}
