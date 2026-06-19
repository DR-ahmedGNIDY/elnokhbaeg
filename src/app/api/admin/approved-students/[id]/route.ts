import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { ApprovedStudent } from "@/models/ApprovedStudent";
import { approvedStudentSchema } from "@/lib/validations/content";
import { ok, fail, resolveError, requireApiAdmin } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await requireApiAdmin();
    const { id } = await params;
    // Code is immutable; never overwrite it on edit.
    const data = approvedStudentSchema.partial().parse(await req.json());
    await connectDB();
    const record = await ApprovedStudent.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();
    if (!record) return fail("السجل غير موجود", 404);
    return ok(record);
  } catch (err) {
    return resolveError(err);
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await requireApiAdmin();
    const { id } = await params;
    await connectDB();
    const deleted = await ApprovedStudent.findByIdAndDelete(id);
    if (!deleted) return fail("السجل غير موجود", 404);
    return ok({ deleted: true });
  } catch (err) {
    return resolveError(err);
  }
}
