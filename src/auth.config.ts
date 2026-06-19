import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import { ROLES, USER_STATUS } from "@/lib/constants";

/**
 * Edge-safe Auth.js config. Contains NO Node-only modules (no mongoose,
 * no bcrypt) so it can run inside the middleware/edge runtime.
 * The Credentials provider and DB-touching callbacks live in `auth.ts`.
 */
export const authConfig: NextAuthConfig = {
  trustHost: true,
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
      ? [
          Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
  ],
  callbacks: {
    session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? token.sub ?? "";
        session.user.role = (token.role as typeof ROLES.ADMIN) ?? ROLES.STUDENT;
        session.user.status =
          (token.status as typeof USER_STATUS.ACTIVE) ?? USER_STATUS.ACTIVE;
        session.user.provider = token.provider as string | undefined;
      }
      return session;
    },
  },
};
