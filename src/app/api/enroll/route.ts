import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Course } from "@/models/Course";
import { Enrollment } from "@/models/Enrollment";
import { ok, fail, resolveError, requireApiAuth } from "@/lib/api";

/**
 * Enrols the current user in a course. A real payment gateway would sit in
 * front of this; here we record a paid enrollment which unlocks all lessons.
 */
export async function POST(req: NextRequest) {
  try {
    const user = await requireApiAuth();
    const { courseId } = (await req.json()) as { courseId?: string };
    if (!courseId) return fail("معرّف الدورة مطلوب", 400);

    await connectDB();
    const course = await Course.findById(courseId);
    if (!course || !course.isPublished) return fail("الدورة غير متاحة", 404);

    const existing = await Enrollment.findOne({
      user: user.id,
      course: courseId,
    });
    if (existing) {
      if (existing.paymentStatus !== "paid") {
        existing.paymentStatus = "paid";
        await existing.save();
      }
      return ok({ enrolled: true, already: true });
    }

    await Enrollment.create({
      user: user.id,
      course: courseId,
      paymentStatus: "paid",
      amountPaid: course.price,
      purchaseDate: new Date(),
    });
    await Course.findByIdAndUpdate(courseId, {
      $inc: { enrollmentsCount: 1 },
    });

    return ok({ enrolled: true }, { status: 201 });
  } catch (err) {
    return resolveError(err);
  }
}
