"use client";
import { QUERY_KEYS, REAVALIDAION_TIME } from "@/actions/contants";
import SearchBar from "@/components/dashboard/SearchBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ORGANIZATION } from "@/types/COMMON";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format, formatDistance } from "date-fns";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
const Organizations = () => {
  const searchParams = useSearchParams();

  const query = searchParams.get("query") || "";
  const pathname = usePathname();

  const { replace } = useRouter();
  const sort = searchParams.get("sort") || "";
  const handleSelect = (e: string | Date, key: string) => {
    const params = new URLSearchParams(searchParams);
    if (e) {
      params.set(key, e as string);
    } else {
      params.delete(key);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const { data, isFetching } = useQuery<ORGANIZATION[]>({
    queryKey: [QUERY_KEYS.ALL_ORGANIZATIONS, query, sort],

    queryFn: async () => {
      try {
        const params = new URLSearchParams(searchParams);

        const url = `/api/${
          REAVALIDAION_TIME.ORGANIZATION.type
        }/search?${params.toString()}`;

        const { data } = await axios.get(url);
        return data;
      } catch (error) {
        return [];
      }
    },
  });

  return (
    <>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <SearchBar
          handleSelect={handleSelect}
          placeholder="Search Organizations"
        />
        <div className="flex items-center justify-end gap-4 md:mt-0 mt-5">
          <Select
            onValueChange={(e) => handleSelect(e, "sort")}
            defaultValue={sort}
            key={sort}
          >
            <SelectTrigger className="w-fit">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel onClick={() => handleSelect("", "sort")}>
                  Sort by
                </SelectLabel>
                <SelectItem value="createdAt-desc">Newest</SelectItem>
                <SelectItem value="createdAt-asc">Oldest</SelectItem>
                <SelectItem value="lastModified-desc">Modified</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
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
                  <div className="flex flex-col gap-1 items-start">
                    <span className="text-xs text-muted-foreground mr-1">
                      createdAt :{" "}
                      {format(new Date(organization.createdAt), "dd-MM-yyyy")}
                    </span>
                    <span className="text-xs text-muted-foreground mr-1">
                      Modified :{" "}
                      {formatDistance(
                        new Date(organization.lastModified),

                        new Date(),
                        { addSuffix: true }
                      )}
                    </span>
                  </div>
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
        <h2 className="my-10 text-2xl text-center">
          No Organizations available
        </h2>
      ) : // </center>
      null}
    </>
  );
};

export default Organizations;
