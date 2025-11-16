import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prima";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRECT = process.env.GOOGLE_CLIENT_SECRECT

export const authOptions = {
  session: {
    strategy: 'jwt'
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  callbacks:{
    async signIn({account,user, profile}){
        console.log("🔥 Callback signIn ejecutado 🔥", {account, user, profile });
        if(!profile?.email){
            throw new Error('No Profile');
        }
        try{
            const existingUser = await prisma.user.findUnique({
                where:{email: user.email}
            });
            if(existingUser){

            }
        }
        catch{
            return false; 
        }
        return true;
    }
  }

};


