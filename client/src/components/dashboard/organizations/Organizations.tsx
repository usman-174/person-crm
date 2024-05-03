"use client";
import { API } from "@/constants";
import { USER } from "@/types/USER";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import SearchBar from "@/components/dashboard/SearchBar";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ORGANIZATION, SCHOOL } from "@/types/COMMON";
import { Button } from "@/components/ui/button";
import { formatDistance } from "date-fns";
import Link from "next/link";
import { QUERY_KEYS, REAVALIDAION_TIME } from "@/actions/contants";
import { Plus } from "lucide-react";

type Props = {
  user: USER & {
    token: string;
  };
};

const Organizations = ({ user }: Props) => {
  const [query, setQuery] = useState("");
  const { data, isFetching } = useQuery<ORGANIZATION[]>({
    queryKey: [QUERY_KEYS.ALL_ORGANIZATIONS, query],

    queryFn: async () => {
      try {
        const url =
          query.length > 2
            ? API +
              `${REAVALIDAION_TIME.ORGANIZATION.type}/search?query=${query}`
            : API + `${REAVALIDAION_TIME.ORGANIZATION.type}`;
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
  console.log({ data });

  return (
    <>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <SearchBar
          query={query}
          setQuery={setQuery}
          placeholder="Search Organizations"
        />
        <div className="text-right w-full">
          <Link href={"/dashboard/organizations/add"}>
            <Button variant={"link"} className="text-lg">
              <Plus size={"25"} />
              Add Organization
            </Button>
          </Link>
        </div>
      </div>

      {isFetching && !data?.length! ? (
        <div className="grid grid-cols-1 gap-2 justify-items-stretch sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 mt-10 mx-auto">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="w-[400px] mx-2">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
        </div>
      ) : null}
      {data?.length ? (
        <div className="grid grid-cols-1 gap-2 justify-items-stretch sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 mt-10 mx-auto">
          {data.map((organization) => (
            <center key={organization.id}>
              <Card className=" ">
                <CardContent>
                  <div className="flex flex-col items-start justify-center gap-2 mt-3">
                    <span className="text-md md:text-lg font-semibold">
                      {organization.name}
                    </span>
                    <p className=" flex flex-wrap gap-4 md:flex-nowrap text-muted-foreground text-xs md:text-sm">
                      <span>
                        <span className="text-primary">City</span> :{" "}
                        {organization.city}
                      </span>
                    </p>
                    <div className="text-muted-foreground text-xs md:text-sm">
                      <span className="text-primary">Heads</span> :{" "}
                      {organization.heads?.length}
                    </div>
                    <div className="text-muted-foreground text-xs md:text-sm">
                      <span className="text-primary">Schools</span> :{" "}
                      {organization.schools?.length}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground mr-1">
                    Modified :{" "}
                    {formatDistance(
                      new Date(organization.lastModified),

                      new Date(),
                      { addSuffix: true }
                    )}
                  </span>
                  <Link href={"/dashboard/organizations/" + organization.id}>
                    <Button variant={"outline"}>Details</Button>
                  </Link>
                </CardFooter>
              </Card>
            </center>
          ))}
        </div>
      ) : !isFetching ? (
        // <center>
        <h2 className="my-10 text-2xl text-center">No Organizations available</h2>
      ) : // </center>
      null}
    </>
  );
};

export default Organizations;
