import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Article } from "@/models/Article";
import { articleSchema } from "@/lib/validations/content";
import { ok, fail, resolveError, requireApiAdmin } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await requireApiAdmin();
    const { id } = await params;
    const data = articleSchema.partial().parse(await req.json());
    await connectDB();
    const article = await Article.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();
    if (!article) return fail("المقال غير موجود", 404);
    return ok(article);
  } catch (err) {
    return resolveError(err);
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await requireApiAdmin();
    const { id } = await params;
    await connectDB();
    const deleted = await Article.findByIdAndDelete(id);
    if (!deleted) return fail("المقال غير موجود", 404);
    return ok({ deleted: true });
  } catch (err) {
    return resolveError(err);
  }
}
