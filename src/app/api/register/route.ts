import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { hashPassword } from "@/lib/password";
import { registerSchema } from "@/lib/validations/auth";
import { ok, fail, handleError } from "@/lib/api";
import { ROLES, USER_STATUS, AUTH_PROVIDERS } from "@/lib/constants";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = registerSchema.parse(body);

    await connectDB();
    const exists = await User.findOne({ email: data.email.toLowerCase() });
    if (exists) {
      return fail("هذا البريد الإلكتروني مسجل بالفعل", 409);
    }

    const hashed = await hashPassword(data.password);
    const user = await User.create({
      name: data.name,
      email: data.email.toLowerCase(),
      password: hashed,
      provider: AUTH_PROVIDERS.CREDENTIALS,
      role: ROLES.STUDENT,
      status: USER_STATUS.ACTIVE,
    });

    return ok(
      { id: user._id.toString(), email: user.email },
      { status: 201 },
    );
  } catch (err) {
    return handleError(err);
  }
}
