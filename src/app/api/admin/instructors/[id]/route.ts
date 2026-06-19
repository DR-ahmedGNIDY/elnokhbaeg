import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Instructor } from "@/models/Instructor";
import { Course } from "@/models/Course";
import { instructorSchema } from "@/lib/validations/content";
import { ok, fail, resolveError, requireApiAdmin } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await requireApiAdmin();
    const { id } = await params;
    const data = instructorSchema.partial().parse(await req.json());
    await connectDB();
    const instructor = await Instructor.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();
    if (!instructor) return fail("المحاضر غير موجود", 404);
    return ok(instructor);
  } catch (err) {
    return resolveError(err);
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await requireApiAdmin();
    const { id } = await params;
    await connectDB();
    const deleted = await Instructor.findByIdAndDelete(id);
    if (!deleted) return fail("المحاضر غير موجود", 404);
    // Unlink from any courses to avoid dangling refs.
    await Course.updateMany({ instructor: id }, { instructor: null });
    return ok({ deleted: true });
  } catch (err) {
    return resolveError(err);
  }
}
