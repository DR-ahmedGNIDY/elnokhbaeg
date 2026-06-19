import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { changePasswordSchema } from "@/lib/validations/auth";
import { hashPassword, verifyPassword } from "@/lib/password";
import { ok, fail, resolveError, requireApiAuth } from "@/lib/api";

export async function PUT(req: NextRequest) {
  try {
    const sessionUser = await requireApiAuth();
    const data = changePasswordSchema.parse(await req.json());
    await connectDB();

    const user = await User.findById(sessionUser.id).select("+password");
    if (!user) return fail("المستخدم غير موجود", 404);

    if (!user.password) {
      // Google-only account setting a password for the first time.
      user.password = await hashPassword(data.newPassword);
      await user.save();
      return ok({ message: "تم تعيين كلمة المرور" });
    }

    const valid = await verifyPassword(data.currentPassword, user.password);
    if (!valid) return fail("كلمة المرور الحالية غير صحيحة", 400);

    user.password = await hashPassword(data.newPassword);
    await user.save();
    return ok({ message: "تم تغيير كلمة المرور بنجاح" });
  } catch (err) {
    return resolveError(err);
  }
}
