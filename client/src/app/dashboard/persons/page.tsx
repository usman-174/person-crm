import Persons from "@/components/dashboard/persons/Persons";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { Suspense } from "react";

const page = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  return (
    <div className="">
     
      <h1 className="text-center text-3xl font-semibold">Persons</h1>
      <br />

      <Suspense>
      <Persons user={user} />
      </Suspense>
    </div>
  );
};

export default page;
