import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";
import { login_with_google } from "../domain/auth/loginWith";
import { get_jwt_info } from "../domain/auth/jwtToken";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing Google Client ID or Secret");
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt'
  },
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET
    })
  ],
  callbacks: {
    async signIn({ account, user, profile }) {
      if (!profile?.email) {
        throw new Error('No Profile');
      }

      if (account?.provider === 'google') {
        await login_with_google(user);
      }

      return true;
    },

    async jwt({ token, user, account }) {
      // Se consulta la BD en cada refresco del token para que una aprobacion,
      // rechazo o cambio de rol surta efecto sin necesidad de re-login.
      const email = user?.email ?? token.email;

      if (email) {
        const jwt_info = await get_jwt_info({ email });

        if (jwt_info) {
          token.userId = jwt_info.userId;
          token.role = jwt_info.role;
          token.email = jwt_info.email;
          token.accessStatus = jwt_info.accessStatus;
        }
      }

      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId;
        session.user.role = token.role;
        session.user.email = token.email;
        session.user.accessStatus = token.accessStatus;
      }

      return session;
    }
  }
};
