import { Separator } from "@/components/ui/separator";
import { getServerSession } from "next-auth";

import { QUERY_KEYS, REAVALIDAION_TIME } from "@/actions/contants";
import { getIncident } from "@/actions/incident";
import { DeleteDialog } from "@/components/dashboard/DeleteDialog";
import ShowImages from "@/components/dashboard/ShowImages";
import { Button } from "@/components/ui/button";
import { INCIDENT } from "@/types/COMMON";
import { authOptions } from "@/utils/authOptions";
import { Pencil } from "lucide-react";
import Link from "next/link";
type props = {
  params: {
    id: string;
  };
};
const renderLabelValuePair = (label: string, value: string | undefined) => {
  if (value) {
    return (
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
        <div>
          <h1 className="text-md font-semibold">{label}</h1>
          <p className="text-muted-foreground text-sm">{value}</p>
        </div>
      </div>
    );
  } else {
    return null;
  }
};
const page = async ({ params }: props) => {
  let incident: INCIDENT | null = await getIncident(params.id);

  if (!incident) return null;
  const session = await getServerSession(authOptions);
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
            {renderLabelValuePair("City", incident.city)}
            {renderLabelValuePair("State", incident.state)}
            {renderLabelValuePair("Country", incident.country)}
          </p>
          <div className="mt-3 flex gap-1 flex-col sm:flex-row items-start md:gap-3">
            {incident.type ? (
              <h1 className="text-sm sm:text-md font-semibold">
                Type :{" "}
                <span className="text-xs sm:text-sm text-muted-foreground">
                  {incident.type}
                </span>
              </h1>
            ) : null}
            {incident.targeted ? (
              <h1 className="text-sm sm:text-md font-semibold">
                Targeted :{" "}
                <span className="text-xs sm:text-sm  text-muted-foreground">
                  {incident.targeted}
                </span>
              </h1>
            ) : null}
            {incident.location ? (
              <h1 className="text-sm sm:text-md font-semibold">
                Location :{" "}
                <span className="text-xs sm:text-sm text-muted-foreground">
                  {incident.location}
                </span>
              </h1>
            ) : null}
          </div>
        </div>
        {/* <OptionsDropDown/>
         */}
        <div className="flex flex-col gap-2 ">
          {user ? (
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
        <div className="flex flex-col gap-2">
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
          <Separator />

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
        {incident?.notes ? (
          <>
            {" "}
            <Separator className="my-5" />
            <div className="text-accent-foreground mb-10">
              <h3 className="text-md font-semibold">Notes</h3>
              <p className="leading-4 ">{incident?.notes || "N/A"}</p>
            </div>
          </>
        ) : null}
        <ShowImages images={incident?.images || []} />
      </div>
    </div>
  );
};

export default page;
