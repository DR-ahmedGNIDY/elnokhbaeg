import "server-only";
import { connectDB } from "@/lib/db";
import { ApprovedStudent } from "@/models/ApprovedStudent";
import { serialize } from "@/lib/serialize";

/**
 * Public credential verification — by CODE only (never by national id).
 * Each code maps to exactly one course record; other records for the same
 * person are intentionally NOT returned.
 */
export async function verifyByCode(code: string) {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return null;
  await connectDB();
  const doc = await ApprovedStudent.findOne({ code: normalized })
    .select("code name photo courseName approvalDate status")
    .lean();
  return doc ? serialize(doc) : null;
}
