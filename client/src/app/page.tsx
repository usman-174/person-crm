import { getAllPersons } from "@/actions/person";
import PersonCard from "@/components/dashboard/persons/PersonCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { PERSON } from "@/types/COMMON";
import { authOptions } from "@/utils/authOptions";
import { formatDistance } from "date-fns";
import { Plus } from "lucide-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const persons: PERSON[] = await getAllPersons();
  const session = await getServerSession(authOptions);
  if (!persons) return <div>loading...</div>;
  const user = session?.user;

  return (
    <div className="sm:container mx-auto mt-10">
      <h1 className="text-center text-3xl font-semibold mb-10">Persons CRM</h1>
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
        <div className="grid grid-cols-1 gap-2 justify-items-stretch sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 mt-10 mx-auto">
          {persons?.map((person, i) => (
            <PersonCard key={person.id} person={person} />
          ))}
        </div>
      ) : (
        <div className="text-center text-2xl font-semibold">
          No Persons Found
        </div>
      )}
    </div>
  );
}
