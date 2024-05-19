import { getAllPersons } from "@/actions/person";
import HomePage from "@/components/dashboard/persons/HomePage";
import PersonCard from "@/components/dashboard/persons/PersonCard";
import { Button } from "@/components/ui/button";
import { PERSON } from "@/types/COMMON";
import { authOptions } from "@/utils/authOptions";
import { Plus } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function Home() {
  const persons: PERSON[] = await getAllPersons();
  const session = await getServerSession(authOptions);
  if (!persons) return <div>loading...</div>;
  const user = session?.user;

  return (
    <div className="sm:container mx-auto mt-10">
      <h1 className="h1 text-center mx-auto">The True Faces.</h1>
      {user?.role === "ADMIN" ? (
        <div className="text-right w-full">
          <Link href={"/dashboard/persons/add"}>
            <Button variant={"link"} className="text-lg">
              <Plus size={"25"} />
              Add Peron
            </Button>
          </Link>
        </div>
      ) : null}
      {persons?.length ? (
       <HomePage persons={persons}/>
      ) : (
        <div className="text-center text-2xl font-semibold">
          Dignity is a mask we wear to hide our ignorance. - Elbert Hubbard
        </div>
      )}
    </div>
  );
}
