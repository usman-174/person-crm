"use client";
import { QUERY_KEYS, REAVALIDAION_TIME } from "@/actions/contants";
import SearchBar from "@/components/dashboard/SearchBar";
import { Button } from "@/components/ui/button";
import { format, formatDistance } from "date-fns";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SCHOOL } from "@/types/COMMON";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Plus } from "lucide-react";
import Image from "next/image";
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
  const city = searchParams.get("city") || "non";
  const state = searchParams.get("state") || "non";

  const handleSelect = (e: string | Date, key: string) => {
    const params = new URLSearchParams(searchParams);
    if (params.get(key) === e) {
      params.delete(key);
      replace(`${pathname}?${params.toString()}`);
    }
    if (e && e !== "non") {
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
        <div className="flex lg:items-center items-start gap-2 flex-col lg:flex-row justify-end lg:justify-start">
          <SearchBar handleSelect={handleSelect} placeholder="Search Schools" />
          <Select
            onValueChange={(e) => handleSelect(e, "city")}
            defaultValue={city}
         
          >
            <SelectTrigger className="w-fit md:min-w-32">
              <SelectValue placeholder="City" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={"non"}>Select City</SelectItem>
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
          
          >
            <SelectTrigger className=" w-fit md:min-w-32">
              <SelectValue placeholder="State" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={"non"}>Select State</SelectItem>
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
            <Button variant={"link"} className="text-md md:text-lg">
              <Plus size={"22"} />
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
        <Table className="overflow-x-auto min-w-[700px] md:w-full mt-20">
          {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead className="">Name</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>City</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Notes</TableHead>

              <TableHead>LastModified</TableHead>
              <TableHead>CreatedAt</TableHead>
              <TableHead>Photo</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((school) => (
              <TableRow key={school.name || "N/A"}>
                <TableCell>{school.name || "N/A"}</TableCell>
                <TableCell>{school.country || "N/A"}</TableCell>
                <TableCell>{school.city || "N/A"}</TableCell>
                <TableCell>{school.state || "N/A"}</TableCell>
                <TableCell className="break-all max-w-36 truncate">
                  {school.notes?.slice(0, 60) || "N/A"}
                 
                </TableCell>

                <TableCell>
                  {formatDistance(new Date(school.lastModified), new Date(), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell>
                  {format(new Date(school.createdAt), "dd/MM/yyyy")}
                </TableCell>
                <TableCell>
                  {school.images.length ? (
                    <Image
                      src={school.images[0].url}
                      alt={school.name}
                      width={100}
                      height={100}
                      className="w-14 h-14 rounded-sm"
                    />
                  ) : (
                    <span>N/A</span>
                  )}
                </TableCell>
                <TableCell>
                  <Link href={`/dashboard/schools/${school.id}`}>
                    <Button variant="outline">Details</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          {/* <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter> */}
        </Table>
      ) : !isFetching ? (
        // <center>
        <h2 className="my-10 text-2xl text-center">No Schools available</h2>
      ) : // </center>
      null}
    </div>
  );
};

export default Schools;
