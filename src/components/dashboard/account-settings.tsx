"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, KeyRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MediaUpload } from "@/components/shared/media-upload";
import { FieldError } from "@/components/shared/field-error";
import {
  updateProfileSchema,
  changePasswordSchema,
} from "@/lib/validations/auth";
import { api } from "@/lib/api-client";
import { toast } from "@/store/toast";
import { z } from "zod";

type ProfileValues = z.infer<typeof updateProfileSchema>;
type PasswordValues = z.infer<typeof changePasswordSchema>;

export function AccountSettings({
  initial,
}: {
  initial: { name: string; email: string; avatar: string | null };
}) {
  const { update } = useSession();
  const [avatar, setAvatar] = useState(initial.avatar ?? "");

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: initial.name },
  });

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  async function saveProfile(values: ProfileValues) {
    try {
      await api.put("/api/account/profile", { name: values.name, avatar });
      await update({ name: values.name, image: avatar || null });
      toast.success("تم تحديث ملفك الشخصي");
    } catch (err) {
      toast.error("تعذّر الحفظ", (err as Error).message);
    }
  }

  async function savePassword(values: PasswordValues) {
    try {
      await api.put("/api/account/password", values);
      toast.success("تم تغيير كلمة المرور");
      passwordForm.reset();
    } catch (err) {
      toast.error("تعذّر التغيير", (err as Error).message);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Profile */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h2 className="font-display text-lg font-bold text-maroon-900">
          الملف الشخصي
        </h2>
        <form onSubmit={profileForm.handleSubmit(saveProfile)} className="mt-5 space-y-4">
          <MediaUpload
            folder="avatars"
            type="image"
            value={avatar}
            onChange={(url) => setAvatar(url)}
            label="الصورة الشخصية"
          />
          <div>
            <Label>الاسم الكامل</Label>
            <Input className="mt-1.5" {...profileForm.register("name")} />
            <FieldError message={profileForm.formState.errors.name?.message} />
          </div>
          <div>
            <Label>البريد الإلكتروني</Label>
            <Input className="mt-1.5" value={initial.email} dir="ltr" disabled />
            <p className="mt-1 text-xs text-muted-foreground">
              لا يمكن تغيير البريد الإلكتروني.
            </p>
          </div>
          <Button type="submit" disabled={profileForm.formState.isSubmitting}>
            {profileForm.formState.isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            حفظ التغييرات
          </Button>
        </form>
      </div>

      {/* Password */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h2 className="font-display text-lg font-bold text-maroon-900">كلمة المرور</h2>
        <form onSubmit={passwordForm.handleSubmit(savePassword)} className="mt-5 space-y-4">
          <div>
            <Label>كلمة المرور الحالية</Label>
            <Input type="password" className="mt-1.5" {...passwordForm.register("currentPassword")} />
            <FieldError message={passwordForm.formState.errors.currentPassword?.message} />
            <p className="mt-1 text-xs text-muted-foreground">
              إن سجّلت عبر Google ولم تعيّن كلمة مرور، اتركها فارغة لتعيين واحدة جديدة.
            </p>
          </div>
          <div>
            <Label>كلمة المرور الجديدة</Label>
            <Input type="password" className="mt-1.5" {...passwordForm.register("newPassword")} />
            <FieldError message={passwordForm.formState.errors.newPassword?.message} />
          </div>
          <div>
            <Label>تأكيد كلمة المرور</Label>
            <Input type="password" className="mt-1.5" {...passwordForm.register("confirmPassword")} />
            <FieldError message={passwordForm.formState.errors.confirmPassword?.message} />
          </div>
          <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
            {passwordForm.formState.isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <KeyRound className="h-4 w-4" />
            )}
            تغيير كلمة المرور
          </Button>
        </form>
      </div>
    </div>
  );
}
