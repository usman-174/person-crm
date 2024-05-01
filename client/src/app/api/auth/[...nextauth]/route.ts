import axiosInstance from "@/lib/axios";
import axios from "axios";
import NextAuth, { AuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions :AuthOptions ={
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        let user = null;
        if (!credentials) {
          return user;
        }
        try {
          const { data } = await axiosInstance.post(
            `${process.env.NEXT_PUBLIC_API || process.env.API}/auth/login`,
            {
              username: credentials.username!,
              password: credentials.password!,
            }
          );

          user = {
            user:data.user,
            token: data.token,
          
          }
        
          
          return user as any;
        } catch (error: any) {
          console.log("error", error?.response.data.message);

          throw new Error(error?.response.data.message);
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {

      if (!token) return session;
      session.user = token.user as User;
      session.user.token = String(token.token);
      return session;
    },
    async jwt({ trigger, token, user, session }) {
   
      
      return { ...token, ...user };
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 Days
  },
}
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

