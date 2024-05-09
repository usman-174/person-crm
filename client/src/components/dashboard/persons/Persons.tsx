"use client";
import { QUERY_KEYS, REAVALIDAION_TIME } from "@/actions/contants";
import SearchBar from "@/components/dashboard/SearchBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PERSON } from "@/types/COMMON";
import { USER } from "@/types/USER";
import { useQuery } from "@tanstack/react-query";
import { formatDistance } from "date-fns";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Props = {
  user: USER & {
    token: string;
  };
};

const Persons = ({ user }: Props) => {
  const [query, setQuery] = useState("");
  const { data, isFetching } = useQuery<PERSON[]>({
    queryKey: [QUERY_KEYS.ALL_PERSONS, query],

    queryFn: async () => {
      try {
        const url =
          query.length > 2
            ?`/api/${REAVALIDAION_TIME.PERSON.type}/search?query=${query}`
            :`/api/${REAVALIDAION_TIME.PERSON.type}`;
        const res = await fetch(url, {
          headers: {
            Authorization: "Bearer " + user.token,
          },
        });
        return res.json();
      } catch (error) {
        return [];
      }
    },
  });

  return (
    <div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <SearchBar
          query={query}
          setQuery={setQuery}
          placeholder="Search Persons..."
        />
        <div className="text-right w-full">
          <Link href={"/dashboard/persons/add"}>
            <Button variant={"link"} className="text-lg">
              <Plus size={"25"} />
              Add Peron
            </Button>
          </Link>
        </div>
      </div>

      {isFetching && !data?.length! ? (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-10">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="w-[400px] mx-2">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
        </div>
      ) : null}
      {data?.length ? (
        <div className="grid grid-cols-1 gap-2 justify-items-stretch sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 mt-10 mx-auto">
          {data.map((person,i) => (
            <Card key={person.id+i}>
              <CardContent>
                <div className="flex items-center justify-start gap-2 mt-3">
                  <Image
                    src={
                      person?.mainPhoto ||
                      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" ||
                      "/profile.png"
                    }
                    alt={person.fullName||"Profile Image"}
                    width={80}
                    height={80}
                    className="rounded-sm w-20  aspect-square "
                  />
                  <div className="flex gap-1 flex-col items-start justify-start">
                    <h1 className="text-sm md:text-lg font-semibold break-all">
                      {person.fname + " " + person.lname}
                    </h1>
                    <span className="text-muted-foreground text-xs md:text-sm">
                      {person.username}
                    </span>
                  </div>
                </div>
                <br />
                <div>
                  <span className="text-sm font-semibold">
                    Recent Incidents: {person.incidents?.length}
                  </span>
                  <div className="flex flex-col items-start gap-3">
                    {person.incidents?.slice(0, 2).map((incident,i) => (
                      <Link key={incident.id+i} href={"/dashboard/incidents/"+incident.id}>
                      <div >
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
              <CardFooter className="flex items-center justify-between">
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
      ) : !isFetching ? (
        // <center>
        <h2 className="my-10 text-2xl text-center">No Persons available</h2>
      ) : // </center>
      null}
    </div>
  );
};

export default Persons;
