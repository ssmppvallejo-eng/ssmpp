import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      role: string;
      email: string;
      valid: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id: number;
    role: string;
    email: string;
    valid: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: number;
    role: string;
    email: string;
    valid: boolean;
    accessToken?: string;
  }
}
