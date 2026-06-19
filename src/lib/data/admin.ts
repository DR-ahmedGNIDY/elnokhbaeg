import "server-only";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Course } from "@/models/Course";
import { CourseLesson } from "@/models/CourseLesson";
import { Article } from "@/models/Article";
import { Instructor } from "@/models/Instructor";
import { ApprovedStudent } from "@/models/ApprovedStudent";
import { Enrollment } from "@/models/Enrollment";
import { serialize } from "@/lib/serialize";
import { ROLES, USER_STATUS, AUTH_PROVIDERS } from "@/lib/constants";

export async function getAdminStats() {
  await connectDB();
  const [
    totalUsers,
    students,
    googleUsers,
    activeUsers,
    suspendedUsers,
    courses,
    articles,
    instructors,
    approved,
    enrollments,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: ROLES.STUDENT }),
    User.countDocuments({ provider: AUTH_PROVIDERS.GOOGLE }),
    User.countDocuments({ status: USER_STATUS.ACTIVE }),
    User.countDocuments({ status: USER_STATUS.SUSPENDED }),
    Course.countDocuments(),
    Article.countDocuments(),
    Instructor.countDocuments(),
    ApprovedStudent.countDocuments(),
    Enrollment.countDocuments({ paymentStatus: "paid" }),
  ]);
  return {
    totalUsers,
    students,
    googleUsers,
    activeUsers,
    suspendedUsers,
    courses,
    articles,
    instructors,
    approved,
    enrollments,
  };
}

export async function listUsers() {
  await connectDB();
  return serialize(
    await User.find()
      .select("name email avatar provider role status lastLogin createdAt")
      .sort({ createdAt: -1 })
      .lean(),
  );
}

export async function getUserDetail(id: string) {
  await connectDB();
  const user = await User.findById(id)
    .select("name email avatar provider role status lastLogin createdAt")
    .lean();
  if (!user) return null;
  const purchasedCount = await Enrollment.countDocuments({
    user: id,
    paymentStatus: "paid",
  });
  return serialize({ user, purchasedCount });
}

export async function listCoursesAdmin() {
  await connectDB();
  return serialize(
    await Course.find()
      .populate("instructor", "name")
      .sort({ createdAt: -1 })
      .lean(),
  );
}

export async function getCourseAdmin(id: string) {
  await connectDB();
  const course = await Course.findById(id).lean();
  if (!course) return null;
  const lessons = await CourseLesson.find({ course: id })
    .sort({ order: 1 })
    .lean();
  return serialize({ course, lessons });
}

export async function listArticlesAdmin() {
  await connectDB();
  return serialize(
    await Article.find().sort({ createdAt: -1 }).lean(),
  );
}

export async function listInstructorsAdmin() {
  await connectDB();
  return serialize(
    await Instructor.find().sort({ createdAt: -1 }).lean(),
  );
}

export async function listApprovedStudents() {
  await connectDB();
  return serialize(
    await ApprovedStudent.find().sort({ createdAt: -1 }).lean(),
  );
}

/** Lightweight instructor options for course select inputs. */
export async function listInstructorOptions() {
  await connectDB();
  return serialize(
    await Instructor.find().select("name title").sort({ name: 1 }).lean(),
  );
}
