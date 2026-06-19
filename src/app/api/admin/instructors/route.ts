import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Instructor } from "@/models/Instructor";
import { instructorSchema } from "@/lib/validations/content";
import { ok, resolveError, requireApiAdmin } from "@/lib/api";
import { slugify } from "@/lib/utils";

export async function GET() {
  try {
    await requireApiAdmin();
    await connectDB();
    return ok(await Instructor.find().sort({ createdAt: -1 }).lean());
  } catch (err) {
    return resolveError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireApiAdmin();
    const data = instructorSchema.parse(await req.json());
    await connectDB();
    const instructor = await Instructor.create({
      ...data,
      slug: slugify(data.name),
    });
    return ok(instructor, { status: 201 });
  } catch (err) {
    return resolveError(err);
  }
}
