import { z } from "zod";

const url = z.string().url("رابط غير صالح");
const optionalUrl = url.optional().or(z.literal(""));

export const courseSchema = z.object({
  title: z.string().min(3, "اسم الدورة مطلوب").max(160),
  coverImage: optionalUrl,
  shortDescription: z.string().min(10, "الوصف المختصر مطلوب").max(400),
  fullDescription: z.string().min(10, "الوصف الكامل مطلوب"),
  price: z.coerce.number().min(0, "السعر غير صالح"),
  durationMinutes: z.coerce.number().min(0).default(0),
  instructor: z.string().optional().or(z.literal("")),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
});

export const lessonSchema = z.object({
  course: z.string().min(1, "الدورة مطلوبة"),
  title: z.string().min(2, "عنوان الدرس مطلوب"),
  videoUrl: optionalUrl,
  videoPublicId: z.string().optional().or(z.literal("")),
  durationMinutes: z.coerce.number().min(0).default(0),
  order: z.coerce.number().min(1).default(1),
  isFree: z.boolean().default(false),
});

export const articleSchema = z.object({
  title: z.string().min(3, "العنوان مطلوب").max(200),
  image: optionalUrl,
  excerpt: z.string().max(400).optional().or(z.literal("")),
  content: z.string().min(10, "المحتوى مطلوب"),
  author: z.string().optional().or(z.literal("")),
  isPublished: z.boolean().default(true),
});

export const instructorSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  title: z.string().min(2, "المسمى الوظيفي مطلوب"),
  shortBio: z.string().min(5, "النبذة المختصرة مطلوبة").max(300),
  bio: z.string().optional().or(z.literal("")),
  avatar: optionalUrl,
  yearsOfExperience: z.coerce.number().min(0).default(0),
  specialty: z.string().optional().or(z.literal("")),
  social: z
    .object({
      facebook: optionalUrl,
      linkedin: optionalUrl,
      website: optionalUrl,
      whatsapp: z.string().optional().or(z.literal("")),
    })
    .partial()
    .optional(),
  isActive: z.boolean().default(true),
});

export const approvedStudentSchema = z.object({
  name: z.string().min(2, "اسم الطالب مطلوب"),
  nationalId: z
    .string()
    .min(5, "الرقم القومي مطلوب")
    .max(20, "رقم قومي غير صالح"),
  photo: optionalUrl,
  courseName: z.string().min(2, "اسم الكورس مطلوب"),
  approvalDate: z.coerce.date(),
});

export const settingsSchema = z.object({
  about: z.object({
    intro: z.string().optional().or(z.literal("")),
    vision: z.string().optional().or(z.literal("")),
    mission: z.string().optional().or(z.literal("")),
    goals: z.array(z.string()).default([]),
    specialties: z.string().optional().or(z.literal("")),
  }),
  contact: z.object({
    phone: z.string().optional().or(z.literal("")),
    email: z.string().optional().or(z.literal("")),
    address: z.string().optional().or(z.literal("")),
    mapEmbedUrl: z.string().optional().or(z.literal("")),
  }),
});

export const userUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  role: z.enum(["admin", "student"]).optional(),
  status: z.enum(["active", "suspended", "blocked"]).optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  email: z.string().email("بريد إلكتروني غير صالح"),
  phone: z.string().optional().or(z.literal("")),
  message: z.string().min(10, "الرسالة قصيرة جداً"),
});

export type CourseInput = z.infer<typeof courseSchema>;
export type LessonInput = z.infer<typeof lessonSchema>;
export type ArticleInput = z.infer<typeof articleSchema>;
export type InstructorInput = z.infer<typeof instructorSchema>;
export type ApprovedStudentInput = z.infer<typeof approvedStudentSchema>;
