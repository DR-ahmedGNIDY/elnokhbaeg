import { NextRequest } from "next/server";
import { verifyByCode } from "@/lib/data/verify";
import { ok, fail, handleError } from "@/lib/api";

/** Public credential verification by code (e.g. NOK00001). */
export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get("code") ?? "";
    if (!code.trim()) return fail("أدخل كود الاعتماد", 400);
    const record = await verifyByCode(code);
    if (!record) return fail("لم يتم العثور على اعتماد بهذا الكود", 404);
    return ok(record);
  } catch (err) {
    return handleError(err);
  }
}
