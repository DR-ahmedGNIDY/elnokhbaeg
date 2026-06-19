import { DefaultSession } from "next-auth";
import type { Role, UserStatus } from "@/lib/constants";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      status: UserStatus;
      provider?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    role?: Role;
    status?: UserStatus;
    provider?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    status: UserStatus;
    provider?: string;
  }
}
