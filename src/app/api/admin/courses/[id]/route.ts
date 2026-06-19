import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Course } from "@/models/Course";
import { CourseLesson } from "@/models/CourseLesson";
import { Enrollment } from "@/models/Enrollment";
import { courseSchema } from "@/lib/validations/content";
import { ok, fail, resolveError, requireApiAdmin } from "@/lib/api";
import { destroyAsset } from "@/lib/cloudinary";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    await requireApiAdmin();
    const { id } = await params;
    await connectDB();
    const course = await Course.findById(id).lean();
    if (!course) return fail("الدورة غير موجودة", 404);
    const lessons = await CourseLesson.find({ course: id })
      .sort({ order: 1 })
      .lean();
    return ok({ course, lessons });
  } catch (err) {
    return resolveError(err);
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await requireApiAdmin();
    const { id } = await params;
    const data = courseSchema.partial().parse(await req.json());
    await connectDB();
    const course = await Course.findByIdAndUpdate(
      id,
      { ...data, instructor: data.instructor || null },
      { new: true, runValidators: true },
    ).lean();
    if (!course) return fail("الدورة غير موجودة", 404);
    return ok(course);
  } catch (err) {
    return resolveError(err);
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await requireApiAdmin();
    const { id } = await params;
    await connectDB();

    const lessons = await CourseLesson.find({ course: id }).lean();
    await Promise.all(
      lessons
        .filter((l) => l.videoPublicId)
        .map((l) => destroyAsset(l.videoPublicId!, "video")),
    );

    await CourseLesson.deleteMany({ course: id });
    await Enrollment.deleteMany({ course: id });
    await Course.findByIdAndDelete(id);
    return ok({ deleted: true });
  } catch (err) {
    return resolveError(err);
  }
}
