"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/shared/field-error";
import { GoogleButton } from "@/components/auth/google-button";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { toast } from "@/store/toast";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/dashboard";
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginInput) {
    setServerError(null);
    const res = await signIn("credentials", {
      ...values,
      redirect: false,
    });
    if (res?.error) {
      setServerError("بريد إلكتروني أو كلمة مرور غير صحيحة.");
      return;
    }
    toast.success("مرحباً بعودتك!");
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-maroon-900">تسجيل الدخول</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        أهلاً بك مجدداً في مؤسسة النخبة.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        {serverError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {serverError}
          </div>
        )}
        <div>
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input id="email" type="email" dir="ltr" className="mt-1.5" {...register("email")} />
          <FieldError message={errors.email?.message} />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">كلمة المرور</Label>
            <Link href="/forgot-password" className="text-xs font-medium text-maroon-600 hover:underline">
              نسيت كلمة المرور؟
            </Link>
          </div>
          <Input id="password" type="password" className="mt-1.5" {...register("password")} />
          <FieldError message={errors.password?.message} />
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          تسجيل الدخول
        </Button>
      </form>

      <Divider />
      <GoogleButton callbackUrl={callbackUrl} />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        ليس لديك حساب؟{" "}
        <Link href="/register" className="font-semibold text-maroon-700 hover:underline">
          أنشئ حساباً جديداً
        </Link>
      </p>
    </div>
  );
}

function Divider() {
  return (
    <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
      <span className="h-px flex-1 bg-border" />
      أو
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
