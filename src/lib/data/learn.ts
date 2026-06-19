import "server-only";
import { connectDB } from "@/lib/db";
import { Course } from "@/models/Course";
import { CourseLesson } from "@/models/CourseLesson";
import { Enrollment } from "@/models/Enrollment";
import { serialize } from "@/lib/serialize";

/**
 * Resolves a course + its lessons together with per-lesson access for a user.
 * Access rules:
 *   - not logged in        → no videos at all
 *   - logged in, not paid   → only the free lesson(s)
 *   - enrolled (paid)       → every lesson
 */
export async function getCourseForLearner(slug: string, userId?: string) {
  await connectDB();
  const course = await Course.findOne({ slug, isPublished: true })
    .populate("instructor", "name title avatar slug")
    .lean();
  if (!course) return null;

  const lessons = await CourseLesson.find({ course: course._id })
    .sort({ order: 1 })
    .lean();

  let enrollment = null;
  if (userId) {
    enrollment = await Enrollment.findOne({
      user: userId,
      course: course._id,
      paymentStatus: "paid",
    }).lean();
  }

  const isEnrolled = Boolean(enrollment);
  const isLoggedIn = Boolean(userId);

  const lessonsWithAccess = lessons.map((l) => {
    const canView = isEnrolled || (isLoggedIn && l.isFree);
    return {
      ...l,
      canView,
      // Never leak the video URL for a locked lesson.
      videoUrl: canView ? l.videoUrl : "",
    };
  });

  return serialize({
    course,
    lessons: lessonsWithAccess,
    isEnrolled,
    isLoggedIn,
    enrollment,
  });
}

export async function getUserEnrollments(userId: string) {
  await connectDB();
  const enrollments = await Enrollment.find({
    user: userId,
    paymentStatus: "paid",
  })
    .populate(
      "course",
      "title slug coverImage shortDescription lessonsCount durationMinutes",
    )
    .sort({ createdAt: -1 })
    .lean();
  return serialize(enrollments);
}
