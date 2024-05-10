import { Separator } from "@/components/ui/separator";
import { getServerSession } from "next-auth";

import { QUERY_KEYS, REAVALIDAION_TIME } from "@/actions/contants";
import { getIncident } from "@/actions/incident";
import { DeleteDialog } from "@/components/dashboard/DeleteDialog";
import { Button } from "@/components/ui/button";
import { INCIDENT } from "@/types/COMMON";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { authOptions } from "@/utils/authOptions";
type props = {
  params: {
    id: string;
  };
};

const page = async ({ params }: props) => {
  const session = await getServerSession(authOptions);
  let incident: INCIDENT | null = await getIncident(params.id);

  if (!incident) return null;
  const user = session?.user;
  return (
    <div>
      <div className="flex md:items-start md:justify-between flex-col-reverse md:flex-row mb-5">
        <div>
          <h1 className="font-semibold text-3xl mt-5 md:mt-0">
            {incident?.title}{" "}
          </h1>
          <p className="text-muted-foreground text-sm">
            {new Date(incident.createdAt!).toLocaleDateString()}
          </p>
          <p className="text-accent-foreground text-sm mt-2">{incident?.id}</p>
          <p className=" flex flex-wrap gap-4 md:flex-nowrap text-muted-foreground text-xs md:text-sm">
            <span>
              <span className="text-primary">City</span> :{" "}
              {incident.city || "N/A"}
            </span>
            <span>
              <span className="text-primary">State</span> :{" "}
              {incident.state || "N/A"}
            </span>
          </p>
        </div>
        {/* <OptionsDropDown/>
         */}
        <div className="flex flex-col gap-2 ">
          {user.role === "ADMIN" ? (
            <div className="flex items-center gap-4">
              <DeleteDialog
                queryKey={QUERY_KEYS.ALL_INCIDENTS}
                type={REAVALIDAION_TIME.INCIDENT.type}
                path="/dashboard/incidents"
              />

              <Link href={"/dashboard/incidents/edit/" + incident?.id}>
                <Button variant={"outline"}>
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </Button>
              </Link>
            </div>
          ) : null}
          <p className="text-sm">
            Last Modified by : {incident?.lastModifiedBy?.username || "N/A"}
          </p>
          <p className="text-sm">
            Created by : {incident?.createdBy?.username || "N/A"}
          </p>
        </div>
      </div>

      <div className="">
        <div className="flex flex-col gap-3">
          <div className="">
            <h1 className="text-md font-semibold">
              Persons :{" "}
              <span className="text-sm text-muted-foreground">
                {incident?.persons?.length}
              </span>
            </h1>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-8">
              {incident?.persons?.map((person) => (
                <div key={person.id} className="p-2">
                  <div>
                    <p className="text-muted-foreground text-md uppercase">
                      {person?.fullName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <h1 className="text-md font-semibold">
                      <p className="text-muted-foreground text-sm">
                        {person?.source || "N/A"}
                      </p>
                    </h1>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Separator className="mt-4" />

          <div>
            <h1 className="text-md font-semibold">
              Schools :{" "}
              <span className="text-sm text-muted-foreground">
                {incident?.schools?.length}
              </span>
            </h1>
            <div className="flex flex-wrap md:flex-nowrap flex-row  items-center gap-4 ">
              {incident.schools?.map((school) => (
                <div
                  key={school.id}
                  className="flex gap-2 items-start justify-around shadow-sm p-2"
                >
                  <div>
                    <h1 className="text-md font-semibold">Name</h1>
                    <p className="text-muted-foreground text-sm">
                      {school.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <h1 className="text-md font-semibold">City</h1>
                    <p className="text-muted-foreground text-sm">
                      {school.city || "N/A"}
                    </p>
                  </div>
                  <div>
                    <h1 className="text-md font-semibold">State</h1>
                    <p className="text-muted-foreground text-sm">
                      {school.state || "N/A"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Separator className="my-5" />

            <div>
              <h1 className="text-md font-semibold">
                Organizations :{" "}
                <span className="text-sm text-muted-foreground">
                  {incident?.organizations?.length}
                </span>
              </h1>
              <div className="flex flex-wrap md:flex-nowrap flex-row  items-center gap-4 ">
                {incident.organizations?.map((org) => (
                  <div
                    key={org.id}
                    className="flex gap-2 items-start justify-around shadow-sm p-2"
                  >
                    <div>
                      <h1 className="text-md font-semibold">Name</h1>
                      <p className="text-muted-foreground text-sm">
                        {org.name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <h1 className="text-md font-semibold">City</h1>
                      <p className="text-muted-foreground text-sm">
                        {org.city || "N/A"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Separator className="my-5" />
        <div className="text-accent-foreground md:mx-10 mb-10">
          <h3 className="text-md font-semibold">Notes</h3>
          <p className="leading-4 ">{incident?.notes || "N/A"}</p>
        </div>
      </div>
    </div>
  );
};

export default page;
