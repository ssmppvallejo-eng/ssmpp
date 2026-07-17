import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

type AccessStatus = "PENDIENTE" | "APROBADO" | "RECHAZADO";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      role: string;
      email: string;
      accessStatus: AccessStatus;
    } & DefaultSession["user"];
  }

  interface User {
    id: number;
    role: string;
    email: string;
    accessStatus: AccessStatus;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: number;
    role: string;
    email: string;
    accessStatus: AccessStatus;
    accessToken?: string;
  }
}
