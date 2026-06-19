import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Course } from "@/models/Course";
import { courseSchema } from "@/lib/validations/content";
import { ok, resolveError, requireApiAdmin } from "@/lib/api";
import { slugify } from "@/lib/utils";

export async function GET() {
  try {
    await requireApiAdmin();
    await connectDB();
    const courses = await Course.find()
      .populate("instructor", "name")
      .sort({ createdAt: -1 })
      .lean();
    return ok(courses);
  } catch (err) {
    return resolveError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireApiAdmin();
    const data = courseSchema.parse(await req.json());
    await connectDB();

    const course = await Course.create({
      ...data,
      instructor: data.instructor || null,
      slug: slugify(data.title),
    });
    return ok(course, { status: 201 });
  } catch (err) {
    return resolveError(err);
  }
}
