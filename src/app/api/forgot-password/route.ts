import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { generateResetToken } from "@/lib/password";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { ok, handleError } from "@/lib/api";
import { sendMail, resetEmailTemplate } from "@/lib/mail";
import { env } from "@/lib/env";

export async function POST(req: NextRequest) {
  try {
    const { email } = forgotPasswordSchema.parse(await req.json());
    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() });

    // Always respond success to avoid leaking which emails exist.
    if (user && user.password) {
      const { token, hash } = generateResetToken();
      user.resetToken = hash;
      user.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
      await user.save();

      const link = `${env.APP_URL}/reset-password?token=${token}`;
      await sendMail({
        to: user.email,
        subject: "إعادة تعيين كلمة المرور — مؤسسة النخبة",
        html: resetEmailTemplate(user.name, link),
      });
    }

    return ok({ message: "إذا كان البريد مسجلاً، سنرسل رابط إعادة التعيين." });
  } catch (err) {
    return handleError(err);
  }
}
