"use client";
import { QUERY_KEYS, REAVALIDAION_TIME } from "@/actions/contants";
import SearchBar from "@/components/dashboard/SearchBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { SCHOOL } from "@/types/COMMON";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { formatDistance } from "date-fns";
import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
interface Props {
  cities: string[];
  states: string[];
}

const Schools = ({ cities, states }: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const query = searchParams.get("query") || "";
  const sort = searchParams.get("sort") || "";
  const city = searchParams.get("city") || "";
  const state = searchParams.get("state") || "";

  const handleSelect = (e: string | Date, key: string) => {
    console.log("dwadawd");
    
    const params = new URLSearchParams(searchParams);
    if (params.get(key) === e) {
      params.delete(key);
      replace(`${pathname}?${params.toString()}`);
    }
    if (e) {
      params.set(key, e as string);
    } else {
      params.delete(key);
    }
    replace(`${pathname}?${params.toString()}`);
  };
  const { data, isFetching } = useQuery<SCHOOL[]>({
    queryKey: [QUERY_KEYS.ALL_SCHOOLS, query, sort, city, state],

    queryFn: async () => {
      try {
        const params = new URLSearchParams(searchParams);

        const url = `/api/${
          REAVALIDAION_TIME.SCHOOL.type
        }/search?${params.toString()}`;

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
        <div className="flex md:items-center gap-2 flex-col md:flex-row justify-end md:justify-start">
          <SearchBar handleSelect={handleSelect} placeholder="Search Schools" />
          <Select
            onValueChange={(e) => handleSelect(e, "city")}
            defaultValue={city}
            key={city}
          >
            <SelectTrigger className="min-w-32">
              <SelectValue placeholder="City" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel onClick={() => handleSelect("", "city")}>
                  Citites
                </SelectLabel>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            onValueChange={(e) => handleSelect(e, "state")}
            defaultValue={state}
            key={state}
          >
            <SelectTrigger className="min-w-32">
              <SelectValue placeholder="State" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel onClick={() => handleSelect("", "state")}>
                  States
                </SelectLabel>

                {states.map((state) => (
                  <SelectItem
                    // onClick={() => handleSelect(state, "state")}
                    key={state}
                    value={state}
                  >
                    {state}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
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
          <Link href={"/dashboard/schools/add"}>
            <Button variant={"link"} className="text-lg">
              <Plus size={"25"} />
              Add School
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
          {data.map((school) => (
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
                        {school.city || "N/A"}
                      </span>
                      <span>
                        <span className="text-primary">State</span> :{" "}
                        {school.state || "N/A"}
                      </span>
                    </p>
                    <div className="text-muted-foreground text-xs md:text-sm">
                      <span className="text-primary">Heads</span> :{" "}
                      {school.heads.length}
                    </div>
                    <div className="text-muted-foreground text-xs md:text-sm">
                      <span className="text-primary">Org</span> :{" "}
                      {school?.organization?.name || "N/A"}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex items-center justify-between">
                  <div className="flex flex-col gap-1 items-start">
                    <span className="text-xs text-muted-foreground mr-1">
                      Modified :{" "}
                      {formatDistance(
                        new Date(school.lastModified),

                        new Date(),
                        { addSuffix: true }
                      )}
                    </span>
                  </div>
                  <Link href={"/dashboard/schools/" + school.id}>
                    <Button variant={"outline"}>Details</Button>
                  </Link>
                </CardFooter>
              </Card>
            </center>
          ))}
        </div>
      ) : !isFetching ? (
        // <center>
        <h2 className="my-10 text-2xl text-center">No Schools available</h2>
      ) : // </center>
      null}
    </div>
  );
};

export default Schools;
