import { NextRequest } from "next/server";
import { createUploadSignature, UPLOAD_FOLDERS } from "@/lib/cloudinary";
import { ok, fail, resolveError, requireApiAuth } from "@/lib/api";
import { env } from "@/lib/env";
import { ROLES } from "@/lib/constants";

/**
 * Returns a signed Cloudinary upload payload.
 * Avatars: any authenticated user. All other folders: admin only.
 */
export async function POST(req: NextRequest) {
  try {
    const user = await requireApiAuth();
    if (!env.isCloudinaryEnabled()) {
      return fail("لم يتم إعداد Cloudinary بعد", 503);
    }

    const { folder } = (await req.json()) as { folder?: string };
    const key = (folder ?? "") as keyof typeof UPLOAD_FOLDERS;
    const target = UPLOAD_FOLDERS[key];
    if (!target) return fail("مجلد غير معروف", 400);

    if (key !== "avatars" && user.role !== ROLES.ADMIN) {
      return fail("صلاحيات غير كافية", 403);
    }

    return ok(createUploadSignature(target));
  } catch (err) {
    return resolveError(err);
  }
}
