import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Course } from "@/models/Course";
import { CourseLesson } from "@/models/CourseLesson";
import { lessonSchema } from "@/lib/validations/content";
import { ok, fail, resolveError, requireApiAdmin } from "@/lib/api";

export async function recountCourse(courseId: string) {
  const lessons = await CourseLesson.find({ course: courseId })
    .select("durationMinutes")
    .lean();
  const total = lessons.reduce((sum, l) => sum + (l.durationMinutes || 0), 0);
  await Course.findByIdAndUpdate(courseId, {
    lessonsCount: lessons.length,
    durationMinutes: total,
  });
}

export async function POST(req: NextRequest) {
  try {
    await requireApiAdmin();
    const data = lessonSchema.parse(await req.json());
    await connectDB();

    const course = await Course.findById(data.course);
    if (!course) return fail("الدورة غير موجودة", 404);

    const lesson = await CourseLesson.create(data);
    await recountCourse(data.course);
    return ok(lesson, { status: 201 });
  } catch (err) {
    return resolveError(err);
  }
}
