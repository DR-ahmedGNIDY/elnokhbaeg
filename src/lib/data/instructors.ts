import "server-only";
import { connectDB } from "@/lib/db";
import { Instructor } from "@/models/Instructor";
import { serialize } from "@/lib/serialize";

export async function getActiveInstructors() {
  await connectDB();
  const docs = await Instructor.find({ isActive: true })
    .sort({ createdAt: -1 })
    .lean();
  return serialize(docs);
}

export async function getInstructorBySlug(slug: string) {
  await connectDB();
  const doc = await Instructor.findOne({ slug, isActive: true }).lean();
  return doc ? serialize(doc) : null;
}
