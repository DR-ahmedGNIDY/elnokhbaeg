import "server-only";
import { connectDB } from "@/lib/db";
import { Course } from "@/models/Course";
import { CourseLesson } from "@/models/CourseLesson";
import { Instructor } from "@/models/Instructor";
import { serialize } from "@/lib/serialize";

export interface CourseDTO {
  _id: string;
  title: string;
  slug: string;
  coverImage: string | null;
  shortDescription: string;
  fullDescription: string;
  price: number;
  durationMinutes: number;
  isFeatured: boolean;
  lessonsCount: number;
  enrollmentsCount: number;
  instructor: {
    _id: string;
    name: string;
    title: string;
    avatar: string | null;
    slug: string;
  } | null;
}

const listProjection =
  "title slug coverImage shortDescription price durationMinutes isFeatured lessonsCount enrollmentsCount instructor fullDescription";

export async function getFeaturedCourses(limit = 6): Promise<CourseDTO[]> {
  await connectDB();
  const docs = await Course.find({ isPublished: true, isFeatured: true })
    .select(listProjection)
    .populate("instructor", "name title avatar slug")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
  return serialize(docs) as unknown as CourseDTO[];
}

export async function getPublishedCourses(): Promise<CourseDTO[]> {
  await connectDB();
  const docs = await Course.find({ isPublished: true })
    .select(listProjection)
    .populate("instructor", "name title avatar slug")
    .sort({ createdAt: -1 })
    .lean();
  return serialize(docs) as unknown as CourseDTO[];
}

export async function getCourseBySlug(slug: string) {
  await connectDB();
  const course = await Course.findOne({ slug, isPublished: true })
    .populate("instructor", "name title avatar slug shortBio specialty")
    .lean();
  if (!course) return null;

  const lessons = await CourseLesson.find({ course: course._id })
    .sort({ order: 1 })
    .lean();

  return serialize({ course, lessons });
}

export async function getInstructorCourses(instructorId: string) {
  await connectDB();
  const docs = await Course.find({
    instructor: instructorId,
    isPublished: true,
  })
    .select(listProjection)
    .sort({ createdAt: -1 })
    .lean();
  return serialize(docs) as unknown as CourseDTO[];
}
