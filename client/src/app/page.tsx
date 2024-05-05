import { getAllPersons } from "@/actions/person";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { PERSON } from "@/types/COMMON";
import { authOptions } from "@/utils/authOptions";
import { formatDistance } from "date-fns";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const persons: PERSON[] = await getAllPersons(session?.user?.token);
  if (!persons) return <div>loading...</div>;

  return (
    <div className="sm:container mx-auto mt-10">
      <h1 className="text-center text-3xl font-semibold mb-10">Persons CRM</h1>
      {persons?.length ? (
        <div className="grid grid-cols-1 gap-2 justify-items-stretch sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 mt-10 mx-auto">
          {persons?.map((person) => (
            <Card key={person.id} className="flex flex-col justify-between">
              <CardContent>
                <div className="flex items-center justify-start gap-2 mt-3">
                  <Image
                    src={
                      person?.mainPhoto ||
                      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" ||
                      "/profile.png"
                    }
                    alt={person.username}
                    width={80}
                    height={80}
                    className="rounded-sm w-20  aspect-square "
                  />
                  <div className="flex gap-1 flex-col items-start justify-start">
                    <h1 className="text-sm md:text-lg font-semibold break-all">
                      {person.fname + " " + person.lname}
                    </h1>
                    <span className="text-muted-foreground text-xs md:text-sm break-all">
                      {person.username}
                    </span>
                  </div>
                </div>
                <br />
                <div>
                  <span className="text-sm font-semibold">
                    Recent Incidents:
                  </span>
                  <div className="flex flex-col items-start gap-3">
                    {person.incidents?.slice(0, 2).map((incident) => (
                      <Link
                        key={incident.id}
                        href={"/dashboard/incidents/" + incident.id}
                      >
                        <div>
                          <div className="text-accent-foreground uppercase cursor-pointer text-xs md:text-sm">
                            {incident.title}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </CardContent>
              <br />
              <CardFooter className="flex items-center justify-between mt-auto ">
                <span className="text-xs text-muted-foreground">
                  Modified :{" "}
                  {formatDistance(
                    new Date(person.lastModified),

                    new Date(),
                    { addSuffix: true }
                  )}
                </span>
                <Link href={`/dashboard/persons/${person.id}`}>
                  <Button
                    variant={"outline"}
                    className="bg-background ml-auto "
                  >
                    Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
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
