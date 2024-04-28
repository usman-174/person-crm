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

type Props = {
  user: USER & {
    token: string;
  };
};

const Schools = ({ user }: Props) => {
  const [query, setQuery] = useState("");
  const { data,  isFetching } = useQuery<SCHOOL[]>({
    queryKey: ["schools", query],

    queryFn: async () => {
      try {
        const url =
          query.length > 2
            ? API + `schools/search?query=${query}`
            : API + `schools`;
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
      <SearchBar
        query={query}
        setQuery={setQuery}
        placeholder="Search Schools"
      />

      {isFetching && !data?.length! ? (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-10">
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
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-10 mx-auto">
        {data?.length &&
          data.map((school) => (
            <center key={school.id}>
              <Card className=" p-4">
                <CardContent>
                  <div className="flex items-center justify-start gap-2 mt-3">
                    <span className="text-sm md:text-md font-semibold">
                      {school.name}
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-muted-foreground text-xs md:text-sm">
                    {school.state}
                  </p>
                </CardFooter>
                <CardFooter>
                  <Button variant={"link"}>Details</Button>
                </CardFooter>
              </Card>
            </center>
          ))}
      </div>
    </div>
  );
};

export default Schools;
