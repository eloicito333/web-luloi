import dotenv from 'dotenv';

import GoogleProvider from "next-auth/providers/google";
import { FirestoreAdapter } from "@auth/firebase-adapter"
import { cert } from "firebase-admin/app"
import { getServerSession } from "next-auth";
//import { db } from "@/lib/firebase";

export const authOptions = () => {
  dotenv.config();

  return {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider.default({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile(profile) {
        return {
          ...profile,
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: profile?.role ?? (process.env.NEXTAUTH_DEFAULT_ROL || "USER"),
          personId: profile?.personId
        };
      },
    })
  ],
  adapter:  FirestoreAdapter({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    })
  }),
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.role) {
        session.user.role = token.role;
      }
      if (token?.personId) {
        session.user.personId = token.personId
      }
      return session;
    },
  }   
}}

export const getAuthSession = () => {
  return getServerSession(authOptions());
};