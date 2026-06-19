import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { updateProfileSchema } from "@/lib/validations/auth";
import { ok, fail, resolveError, requireApiAuth } from "@/lib/api";

export async function PUT(req: NextRequest) {
  try {
    const sessionUser = await requireApiAuth();
    const data = updateProfileSchema.parse(await req.json());
    await connectDB();
    const user = await User.findByIdAndUpdate(
      sessionUser.id,
      { name: data.name, ...(data.avatar ? { avatar: data.avatar } : {}) },
      { new: true },
    )
      .select("name email avatar")
      .lean();
    if (!user) return fail("المستخدم غير موجود", 404);
    return ok(user);
  } catch (err) {
    return resolveError(err);
  }
}
