import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { CourseLesson } from "@/models/CourseLesson";
import { lessonSchema } from "@/lib/validations/content";
import { ok, fail, resolveError, requireApiAdmin } from "@/lib/api";
import { destroyAsset } from "@/lib/cloudinary";
import { recountCourse } from "../route";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await requireApiAdmin();
    const { id } = await params;
    const data = lessonSchema.partial().parse(await req.json());
    await connectDB();
    const lesson = await CourseLesson.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();
    if (!lesson) return fail("الدرس غير موجود", 404);
    await recountCourse(lesson.course.toString());
    return ok(lesson);
  } catch (err) {
    return resolveError(err);
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await requireApiAdmin();
    const { id } = await params;
    await connectDB();
    const lesson = await CourseLesson.findByIdAndDelete(id);
    if (!lesson) return fail("الدرس غير موجود", 404);
    if (lesson.videoPublicId) await destroyAsset(lesson.videoPublicId, "video");
    await recountCourse(lesson.course.toString());
    return ok({ deleted: true });
  } catch (err) {
    return resolveError(err);
  }
}
