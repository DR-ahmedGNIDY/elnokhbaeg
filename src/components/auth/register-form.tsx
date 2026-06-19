"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/shared/field-error";
import { GoogleButton } from "@/components/auth/google-button";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { api } from "@/lib/api-client";
import { toast } from "@/store/toast";

export function RegisterForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values: RegisterInput) {
    try {
      await api.post("/api/register", values);
      // Auto sign-in after successful registration.
      await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      toast.success("تم إنشاء حسابك بنجاح");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      const message = (err as Error).message;
      if (message.includes("مسجل")) {
        setError("email", { message });
      } else {
        toast.error("تعذّر إنشاء الحساب", message);
      }
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-maroon-900">إنشاء حساب جديد</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        ابدأ رحلتك التعليمية مع مؤسسة النخبة.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <Label htmlFor="name">الاسم الكامل</Label>
          <Input id="name" className="mt-1.5" {...register("name")} />
          <FieldError message={errors.name?.message} />
        </div>
        <div>
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input id="email" type="email" dir="ltr" className="mt-1.5" {...register("email")} />
          <FieldError message={errors.email?.message} />
        </div>
        <div>
          <Label htmlFor="password">كلمة المرور</Label>
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
          إنشاء حساب
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        أو
        <span className="h-px flex-1 bg-border" />
      </div>
      <GoogleButton callbackUrl="/dashboard" />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        لديك حساب بالفعل؟{" "}
        <Link href="/login" className="font-semibold text-maroon-700 hover:underline">
          تسجيل الدخول
        </Link>
      </p>
    </div>
  );
}
