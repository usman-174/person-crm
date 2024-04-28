import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Persons from "@/components/dashboard/persons/Persons";
import GoBack from "@/components/layout/GoBack";
import { getServerSession } from "next-auth";

const page = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  return (
    <div className="">
     
      <h1 className="text-center text-3xl font-semibold">Persons</h1>
      <br />

      <Persons user={user} />
    </div>
  );
};

export default page;
