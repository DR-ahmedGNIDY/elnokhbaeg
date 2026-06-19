"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/shared/field-error";
import { contactSchema } from "@/lib/validations/content";
import { api } from "@/lib/api-client";
import { toast } from "@/store/toast";
import { z } from "zod";

type FormValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(values: FormValues) {
    try {
      await api.post("/api/contact", values);
      toast.success("تم إرسال رسالتك", "سنتواصل معك في أقرب وقت.");
      reset();
    } catch (err) {
      toast.error("تعذّر الإرسال", (err as Error).message);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">الاسم</Label>
        <Input id="name" className="mt-1.5" {...register("name")} />
        <FieldError message={errors.name?.message} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input id="email" type="email" dir="ltr" className="mt-1.5" {...register("email")} />
          <FieldError message={errors.email?.message} />
        </div>
        <div>
          <Label htmlFor="phone">الهاتف (اختياري)</Label>
          <Input id="phone" dir="ltr" className="mt-1.5" {...register("phone")} />
          <FieldError message={errors.phone?.message} />
        </div>
      </div>
      <div>
        <Label htmlFor="message">الرسالة</Label>
        <Textarea id="message" rows={5} className="mt-1.5" {...register("message")} />
        <FieldError message={errors.message?.message} />
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        إرسال الرسالة
      </Button>
    </form>
  );
}
