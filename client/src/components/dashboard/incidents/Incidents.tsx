"use client";
import { QUERY_KEYS, REAVALIDAION_TIME } from "@/actions/contants";
import SearchBar from "@/components/dashboard/SearchBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { INCIDENT } from "@/types/COMMON";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format, formatDistanceToNow } from "date-fns";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";



const Incidents = () => {
  const [query, setQuery] = useState("");
  const { data, isFetching } = useQuery<INCIDENT[]>({
    queryKey: [QUERY_KEYS.ALL_INCIDENTS, query],

    queryFn: async () => {
      try {
        const url =
          query.length > 2
            ? `/api/${REAVALIDAION_TIME.INCIDENT.type}/search?query=${query}`
            : `/api/${REAVALIDAION_TIME.INCIDENT.type}`;
        const { data } = await axios.get(url);
        return data;
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
          placeholder="Search Incidents"
        />
        <div className="text-right w-full">
          <Link href={"/dashboard/incidents/add"}>
            <Button variant={"link"} className="text-lg">
              <Plus size={"25"} />
              Add Incident
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
          {data.map((incident) => (
            <center key={incident.id}>
              <Card className=" ">
                <CardContent>
                  <div className="flex flex-col items-start justify-center gap-2 mt-3">
                    <span className="text-md md:text-lg font-semibold">
                      {incident?.title}
                    </span>
                    {/* <p className=" flex flex-wrap gap-4 md:flex-nowrap text-muted-foreground text-xs md:text-sm">
                      <span>
                        <span className="text-primary">City</span> :{" "}
                        {incident.city}
                      </span>
                      <span>
                        <span className="text-primary">State</span> :{" "}
                        {incident.state}
                      </span>
                    </p> */}
                    <div className="text-muted-foreground text-xs md:text-sm">
                      <span className="text-primary">Persons</span> :{" "}
                      {incident?.persons?.length}
                    </div>
                    <div className="text-muted-foreground text-xs md:text-sm">
                      <span className="text-primary">Schools</span> :{" "}
                      {incident?.schools?.length}
                    </div>
                    <div className="text-muted-foreground text-xs md:text-sm">
                      <span className="text-primary">Org</span> :{" "}
                      {incident?.organizations?.length}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex items-center justify-between">
                  <div className="flex flex-col gap-1 items-start">
                    <span className="text-xs text-muted-foreground mr-1">
                      Modified :{" "}
                      {formatDistanceToNow(
                        new Date(incident.lastModified),

                        { addSuffix: false }
                      )}
                    </span>
                    <span className="text-xs text-muted-foreground mr-1">
                      Created :{" "}
                      {format(new Date(incident.createdAt), "MMMM dd, yyyy")}
                    </span>
                  </div>

                  <Link href={"/dashboard/incidents/" + incident.id}>
                    <Button variant={"outline"}>Details</Button>
                  </Link>
                </CardFooter>
              </Card>
            </center>
          ))}
        </div>
      ) : !isFetching ? (
        // <center>
        <h2 className="my-10 text-2xl text-center">No Incidents available</h2>
      ) : // </center>
      null}
    </div>
  );
};

export default Incidents;
