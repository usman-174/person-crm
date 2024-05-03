import axios from "axios";
import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
export const authOptions: NextAuthOptions = {
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
          const { data } = await axios.post(
            `${process.env.NEXT_PUBLIC_API || process.env.API}/auth/login`,
            {
              username: credentials.username!,
              password: credentials.password!,
            }
          );

          user = {
            user: data.user,
            token: data.token,
          };

          return user as any;
        } catch (error: any) {
          return {
            error: error?.response?.data?.message || error.message,
          };

          // throw new Error(error?.response.data.message);
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (user?.error) {
        throw new Error(user?.error);
      }
      return true;
    },
    async session({ session, token }) {
      if (!token) return session;
      session.user = token.user as User;
      session.user.token = String(token.token);
      return session;
    },
    async jwt({ trigger, token, user, session }) {
      if (token.error) {
        return token;
      }

      return { ...token, ...user };
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 Days
  },
};
