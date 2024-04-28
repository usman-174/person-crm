"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import UserButton from "./UserButton";

const Navbar = () => {
  const session = useSession();
  
  
  const user = session.data?.user;
 
  return (
    <header className="sticky z-20 top-0 bg-background px-3 shadow-sm">
      <nav className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-3">
        <Link href="/" className="font-bold text-3xl">
          PERSON-CRM
        </Link>
    
        {user && <UserButton user={user} />}
     {!user && session.status !== "loading" && <SignInButton />}
      </nav>
    </header>
  );
};
function SignInButton() {
    const router = useRouter();
  return <Button onClick={() => router.push("/login")}>Sign in</Button>;
}
export default Navbar;
