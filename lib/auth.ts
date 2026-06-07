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
      console.log("🔥 Callback signIn ejecutado 🔥");
      if (!profile?.email) {
        throw new Error('No Profile');
      }

      if (account?.provider === 'google') {
        await login_with_google(user);
      }

      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        const jwt_info = await get_jwt_info(user);

        if (jwt_info) {
          token.userId = jwt_info.userId;
          token.role = jwt_info.role;
          token.email = jwt_info.email;
          token.valid = jwt_info.valid;
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
        session.user.valid = token.valid;
      }

      return session;
    }
  }
};
