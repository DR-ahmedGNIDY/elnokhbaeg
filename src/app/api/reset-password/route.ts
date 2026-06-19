import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { hashPassword, hashResetToken } from "@/lib/password";
import { resetPasswordSchema } from "@/lib/validations/auth";
import { ok, fail, handleError } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = resetPasswordSchema.parse(await req.json());
    await connectDB();

    const hashed = hashResetToken(token);
    const user = await User.findOne({
      resetToken: hashed,
      resetTokenExpiry: { $gt: new Date() },
    }).select("+resetToken +resetTokenExpiry");

    if (!user) {
      return fail("الرابط غير صالح أو منتهي الصلاحية", 400);
    }

    user.password = await hashPassword(password);
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    return ok({ message: "تم تحديث كلمة المرور بنجاح" });
  } catch (err) {
    return handleError(err);
  }
}
