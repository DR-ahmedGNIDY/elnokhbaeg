import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("بريد إلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور قصيرة جداً"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "الاسم مطلوب").max(120),
    email: z.string().email("بريد إلكتروني غير صالح"),
    password: z
      .string()
      .min(8, "كلمة المرور يجب ألا تقل عن 8 أحرف")
      .regex(/[a-zA-Z]/, "يجب أن تحتوي على حرف واحد على الأقل")
      .regex(/[0-9]/, "يجب أن تحتوي على رقم واحد على الأقل"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("بريد إلكتروني غير صالح"),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(10),
    password: z.string().min(8, "كلمة المرور يجب ألا تقل عن 8 أحرف"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

export const updateProfileSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب").max(120),
  avatar: z.string().url().optional().or(z.literal("")),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().optional().default(""),
    newPassword: z.string().min(8, "كلمة المرور يجب ألا تقل عن 8 أحرف"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
