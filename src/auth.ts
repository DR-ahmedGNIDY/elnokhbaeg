import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { verifyPassword } from "@/lib/password";
import { loginSchema } from "@/lib/validations/auth";
import { ROLES, USER_STATUS, AUTH_PROVIDERS } from "@/lib/constants";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    ...authConfig.providers,
    Credentials({
      credentials: {
        email: { label: "البريد الإلكتروني", type: "email" },
        password: { label: "كلمة المرور", type: "password" },
      },
      async authorize(raw) {
        const parsed = loginSchema.safeParse(raw);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        await connectDB();
        const user = await User.findOne({ email: email.toLowerCase() }).select(
          "+password",
        );
        if (!user || !user.password) return null;

        if (user.status !== USER_STATUS.ACTIVE) {
          throw new Error("هذا الحساب موقوف أو محظور. تواصل مع الإدارة.");
        }

        const ok = await verifyPassword(password, user.password);
        if (!ok) return null;

        user.lastLogin = new Date();
        await user.save();

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.avatar ?? undefined,
          role: user.role,
          status: user.status,
          provider: AUTH_PROVIDERS.CREDENTIALS,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,

    /** Upsert Google users into our Users collection on first sign-in. */
    async signIn({ user, account }) {
      if (account?.provider !== "google") return true;
      await connectDB();

      const email = user.email?.toLowerCase();
      if (!email) return false;

      let dbUser = await User.findOne({ email });
      if (!dbUser) {
        dbUser = await User.create({
          name: user.name ?? "مستخدم Google",
          email,
          googleId: account.providerAccountId,
          provider: AUTH_PROVIDERS.GOOGLE,
          avatar: user.image ?? null,
          role: ROLES.STUDENT,
          status: USER_STATUS.ACTIVE,
          lastLogin: new Date(),
        });
      } else {
        if (dbUser.status !== USER_STATUS.ACTIVE) return false;
        dbUser.googleId = dbUser.googleId ?? account.providerAccountId;
        dbUser.avatar = dbUser.avatar ?? user.image ?? null;
        dbUser.lastLogin = new Date();
        await dbUser.save();
      }
      // Stash db id so the jwt callback can read it.
      (user as { id?: string }).id = dbUser._id.toString();
      (user as { role?: string }).role = dbUser.role;
      (user as { status?: string }).status = dbUser.status;
      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id = (user as { id?: string }).id ?? token.sub ?? "";
        token.role = (user as { role?: typeof ROLES.ADMIN }).role ?? ROLES.STUDENT;
        token.status =
          (user as { status?: typeof USER_STATUS.ACTIVE }).status ??
          USER_STATUS.ACTIVE;
        token.provider = account?.provider ?? token.provider;
      }
      return token;
    },
  },
});
