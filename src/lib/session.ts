import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ROLES, type Role } from "@/lib/constants";

export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

/** Server-side guard: returns the user or redirects to /login. */
export async function requireAuth(callbackUrl?: string) {
  const user = await getCurrentUser();
  if (!user) {
    const url = callbackUrl
      ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
      : "/login";
    redirect(url);
  }
  return user;
}

/** Server-side guard: admin only. */
export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?callbackUrl=/admin");
  if (user.role !== ROLES.ADMIN) redirect("/dashboard");
  return user;
}

export function hasRole(role: Role | undefined, target: Role): boolean {
  return role === target;
}
