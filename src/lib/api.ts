import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { auth } from "@/auth";
import { ROLES } from "@/lib/constants";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ success: true, data }, init);
}

export function fail(message: string, status = 400, extra?: unknown) {
  return NextResponse.json(
    { success: false, error: message, details: extra },
    { status },
  );
}

/** Wraps a route handler with uniform error handling. */
export function handleError(err: unknown) {
  if (err instanceof ZodError) {
    return fail("بيانات غير صالحة", 422, err.flatten().fieldErrors);
  }
  if (err instanceof Error) {
    // Duplicate key (e.g. unique email/slug)
    if ((err as { code?: number }).code === 11000) {
      return fail("هذا السجل موجود بالفعل", 409);
    }
    console.error("[API ERROR]", err.message);
    return fail(err.message || "حدث خطأ غير متوقع", 500);
  }
  console.error("[API ERROR]", err);
  return fail("حدث خطأ غير متوقع", 500);
}

/** Returns the session user or throws a 401/403 response via guard helpers. */
export async function requireApiAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new ApiAuthError("يجب تسجيل الدخول", 401);
  }
  return session.user;
}

export async function requireApiAdmin() {
  const user = await requireApiAuth();
  if (user.role !== ROLES.ADMIN) {
    throw new ApiAuthError("صلاحيات غير كافية", 403);
  }
  return user;
}

export class ApiAuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

/** Use in catch blocks to convert ApiAuthError into a response. */
export function resolveError(err: unknown) {
  if (err instanceof ApiAuthError) return fail(err.message, err.status);
  return handleError(err);
}
