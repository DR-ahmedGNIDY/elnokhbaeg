import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { ApprovedStudent } from "@/models/ApprovedStudent";
import { approvedStudentSchema } from "@/lib/validations/content";
import { ok, resolveError, requireApiAdmin } from "@/lib/api";

export async function GET() {
  try {
    await requireApiAdmin();
    await connectDB();
    return ok(await ApprovedStudent.find().sort({ createdAt: -1 }).lean());
  } catch (err) {
    return resolveError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireApiAdmin();
    const data = approvedStudentSchema.parse(await req.json());
    await connectDB();
    // Each save = a new independent record with its own auto NOK code,
    // even if the same student/national id already exists for another course.
    const record = await ApprovedStudent.create(data);
    return ok(record, { status: 201 });
  } catch (err) {
    return resolveError(err);
  }
}
