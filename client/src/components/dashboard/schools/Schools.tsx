"use client";
import { API } from "@/constants";
import { USER } from "@/types/USER";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import SearchBar from "@/components/dashboard/SearchBar";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { SCHOOL } from "@/types/COMMON";
import { Button } from "@/components/ui/button";
import { formatDistance } from "date-fns";
import Link from "next/link";
import { QUERY_KEYS } from "@/actions/contants";

type Props = {
  user: USER & {
    token: string;
  };
};

const Schools = ({ user }: Props) => {
  const [query, setQuery] = useState("");
  const { data, isFetching } = useQuery<SCHOOL[]>({
    queryKey: [QUERY_KEYS.ALL_SCHOOLS, query],

    queryFn: async () => {
      try {
        const url =
          query.length > 2
            ? API + `school/search?query=${query}`
            : API + `school`;
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
    <div>
      <SearchBar
        query={query}
        setQuery={setQuery}
        placeholder="Search Schools"
      />

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
      <div className="grid grid-cols-1 gap-2 justify-items-stretch sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 mt-10 mx-auto">
        {data?.length &&
          data.map((school) => (
            <center key={school.id}>
              <Card className=" ">
                <CardContent>
                  <div className="flex flex-col items-start justify-center gap-2 mt-3">
                    <span className="text-md md:text-lg font-semibold">
                      {school.name}
                    </span>
                    <p className=" flex flex-wrap gap-4 md:flex-nowrap text-muted-foreground text-xs md:text-sm">
                      <span>
                        <span className="text-primary">City</span> :{" "}
                        {school.city}
                      </span>
                      <span>
                        <span className="text-primary">State</span> :{" "}
                        {school.state}
                      </span>
                    </p>
                    <div className="text-muted-foreground text-xs md:text-sm">
                      <span className="text-primary">Head</span> :{" "}
                      {school.head?.name}
                    </div>
                    <div className="text-muted-foreground text-xs md:text-sm">
                      <span className="text-primary">Org</span> :{" "}
                      {school?.organization?.name}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground mr-1">
                    Modified :{" "}
                    {formatDistance(
                      new Date(school.lastModified),

                      new Date(),
                      { addSuffix: true }
                    )}
                  </span>
                  <Link href={"/dashboard/schools/" + school.id}>
                    <Button variant={"outline"}>Details</Button>
                  </Link>
                </CardFooter>
              </Card>
            </center>
          ))}
      </div>
    </div>
  );
};

export default Schools;
