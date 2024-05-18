import { getCount } from "@/actions/dashboard";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { PersonStanding, School, User2, Workflow } from "lucide-react";
import Link from "next/link";
import React from "react";
// import { authOptions } from "../api/auth/[...nextauth]/route";

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
const page = async () => {
  const counts = await getCount();

  return (
    <div className="container mx-auto">
      <h1 className="text-center text-lg sm:text-2xl md:text-3xl font-semibold">
        Manage data
      </h1>
      <div className="flex flex-wrap md:flex-nowrap md:justify-around md:items-center mt-10 gap-5 md:gap-3">
        {dataModels.map((model, ind) => (
          <Link href={model.url} key={ind}>
            <Card className="w-44">
              <CardContent>
                <div className="flex items-center justify-start gap-2 mt-3">
                  <model.Icon className="w-6 h-6" />
                  <span className="text-sm md:text-md font-semibold">
                    {model.name}
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-muted-foreground text-xs md:text-sm">
                  Total:{" "}
                  <span className="text-accent-foreground">
                    {counts[model.key]||0}
                  </span>
                </p>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default page;
