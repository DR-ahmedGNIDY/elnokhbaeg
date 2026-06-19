import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Enrollment } from "@/models/Enrollment";
import { userUpdateSchema } from "@/lib/validations/content";
import { ok, fail, resolveError, requireApiAdmin } from "@/lib/api";
import { ROLES } from "@/lib/constants";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    await requireApiAdmin();
    const { id } = await params;
    await connectDB();
    const user = await User.findById(id)
      .select("name email avatar provider role status lastLogin createdAt")
      .lean();
    if (!user) return fail("المستخدم غير موجود", 404);
    const purchasedCount = await Enrollment.countDocuments({
      user: id,
      paymentStatus: "paid",
    });
    return ok({ ...user, purchasedCount });
  } catch (err) {
    return resolveError(err);
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const admin = await requireApiAdmin();
    const { id } = await params;
    const data = userUpdateSchema.parse(await req.json());
    await connectDB();

    // Prevent an admin from demoting / suspending their own account.
    if (admin.id === id && (data.role === ROLES.STUDENT || data.status)) {
      return fail("لا يمكنك تعديل دور أو حالة حسابك بنفسك", 400);
    }

    const user = await User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    })
      .select("name email avatar provider role status lastLogin createdAt")
      .lean();
    if (!user) return fail("المستخدم غير موجود", 404);
    return ok(user);
  } catch (err) {
    return resolveError(err);
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const admin = await requireApiAdmin();
    const { id } = await params;
    if (admin.id === id) return fail("لا يمكنك حذف حسابك الخاص", 400);
    await connectDB();
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return fail("المستخدم غير موجود", 404);
    await Enrollment.deleteMany({ user: id });
    return ok({ deleted: true });
  } catch (err) {
    return resolveError(err);
  }
}
