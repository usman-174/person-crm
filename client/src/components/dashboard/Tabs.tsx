"use client";
import { Card, CardContent } from "@/components/ui/card";
import { PersonStanding, School, User2, Workflow } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
interface DataModel {
  name: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
  url: string;
  key: keyof Counts; // Specify that 'key' must be a key of 'Counts' type
}

interface Counts {
  personCount: number;
  schoolCount: number;
  organizationCount: number;
  incidentCount: number;
}

const dataModels: DataModel[] = [
  {
    name: "Persons",
    description: "Manage Persons data",
    Icon: User2,
    url: "/dashboard/persons",
    key: "personCount",
  },
  {
    name: "Schools",
    description: "Manage School data",
    Icon: School,
    url: "/dashboard/schools",
    key: "schoolCount",
  },
  {
    name: "Organization",
    description: "Manage Organization data",
    Icon: PersonStanding,
    url: "/dashboard/organizations",
    key: "organizationCount",
  },
  {
    name: "Incidents",
    description: "Manage Incidents data",
    Icon: Workflow,
    url: "/dashboard/incidents",
    key: "incidentCount",
  },
];
const Tabs = () => {
  const pathname = usePathname();
  if (pathname === "/dashboard" || pathname.includes("/add") || pathname.includes("/edit") ) return null;
  return (
    <div className="flex flex-wrap md:flex-nowrap justify-center items-center  gap-1 md:gap-3 mb-5">
      {dataModels.map((model, ind) => (
        <Link href={model.url} key={ind}>
          <Card
            className={`w-fit mb-0 ${
              pathname.includes(model.url) ? " border-black" : ""
            }`}
          >
            <CardContent>
              <div className="flex items-center justify-start gap-2 mt-3 mb-0">
                <model.Icon className="w-6 h-6" />
                <span className="text-sm md:text-md font-semibold">
                  {model.name}
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default Tabs;
