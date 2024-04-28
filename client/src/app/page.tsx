import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="">
      <div className="text-center">
        {/* <Image src="/logo.png" alt="logo" width={200} height={200} /> */}
        <h1 className="text-2xl font-bold">Welcome to Person CRM</h1>
        <br />
        <p className="text-lg">The best CRM for managing your contacts</p>
        <br />
        <Link href="/dashboard">
          <Button>Get Started</Button>
        </Link>
      </div>
    </div>
  );
}
