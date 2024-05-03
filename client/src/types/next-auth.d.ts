import { DefaultSession } from "next-auth";
import {User} from "@/types/user"
declare module "next-auth" {
  interface Session {
    user: User & DefaultSession["user"] & USER;
  }

  interface User {
    // role: String | null;
    // error : String | null;
    // User
    token: string| null;
    error?: string | null;

  }
}