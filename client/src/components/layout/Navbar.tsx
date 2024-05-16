"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { signOut, useSession } from "next-auth/react";
import UserButton from "./UserButton";
import { LogOut } from "lucide-react";

const Navbar = () => {
  const session = useSession();

  const user = session.data?.user;
  return (
    <header className="sticky z-20 top-0 bg-background px-3 shadow-sm">
      <nav className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-3">
        <Link href="/" className="font-bold text-lg sm:text-xl md:text-3xl">
          PERSON-CRM
        </Link>
        <div className="flex items-center gap-3 md:gap-10 ">
          {/* {user && <UserButton user={user} />} */}

          
          {user && session.status !== "loading" ? (
            <>
              <Link
                href="/dashboard"
                className="font-semibold text-sm md:text-md"
              >
                Dashboard
              </Link>
              <Button
                size={"sm"}
                variant={"outline"}
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut size={20} />
                SignOut
              </Button>
            </>
          ) : !user && session.status !== "loading" ? (
            <SignInButton />
          ) : null}
        </div>
      </nav>
    </header>
  );
};
function SignInButton() {
  const router = useRouter();
  return <Button onClick={() => router.push("/login")}>Sign in</Button>;
}
export default Navbar;
