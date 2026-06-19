import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { CourseLesson } from "@/models/CourseLesson";
import { Enrollment } from "@/models/Enrollment";
import { ok, fail, resolveError, requireApiAuth } from "@/lib/api";

/** Records the last lesson viewed and recomputes completion percentage. */
export async function POST(req: NextRequest) {
  try {
    const user = await requireApiAuth();
    const { courseId, lessonId, completed } = (await req.json()) as {
      courseId?: string;
      lessonId?: string;
      completed?: boolean;
    };
    if (!courseId || !lessonId) return fail("بيانات ناقصة", 400);

    await connectDB();
    const enrollment = await Enrollment.findOne({
      user: user.id,
      course: courseId,
      paymentStatus: "paid",
    });
    if (!enrollment) return fail("غير مشترك في هذه الدورة", 403);

    enrollment.lastLessonViewed = lessonId as never;
    if (completed) {
      const set = new Set(
        enrollment.completedLessons.map((l) => l.toString()),
      );
      set.add(lessonId);
      enrollment.completedLessons = Array.from(set) as never;
    }

    const total = await CourseLesson.countDocuments({ course: courseId });
    enrollment.progress = total
      ? Math.round((enrollment.completedLessons.length / total) * 100)
      : 0;
    await enrollment.save();

    return ok({ progress: enrollment.progress });
  } catch (err) {
    return resolveError(err);
  }
}
