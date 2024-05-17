import { getPerson } from "@/actions/person";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

import { QUERY_KEYS } from "@/actions/contants";
import { DeleteDialog } from "@/components/dashboard/DeleteDialog";
import ShowImages from "@/components/dashboard/ShowImages";
import { Button } from "@/components/ui/button";
import { PERSON } from "@/types/COMMON";
import { authOptions } from "@/utils/authOptions";
import { differenceInYears } from "date-fns";
import { Pencil } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";

function calculateAge(dateOfBirth: Date) {
  const today = new Date();
  return differenceInYears(today, dateOfBirth);
}
type props = {
  params: {
    id: string;
  };
};

const page = async ({ params }: props) => {
  let person: PERSON | null = null;
  const session = await getServerSession(authOptions);
  let user = null;
  if (session) {
    user = session.user;
  }
  person = await getPerson(params.id);
  if (!person) return null;

  // Function to render label-value pair if value is defined
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

  return (
    <div className="">
      <div className="flex md:items-start md:justify-between flex-col-reverse md:flex-row">
        <div>
          <h1 className="font-semibold text-3xl">
            {person?.fullName}{" "}
            <span className="text-muted-foreground text-xs">
              {person?.username}
            </span>{" "}
          </h1>
          <p className="text-muted-foreground text-sm">
            {new Date(person.createdAt!).toLocaleDateString()}
          </p>
          <p className="text-accent-foreground text-sm mt-4">{person?.id}</p>
        </div>
        {/* <OptionsDropDown/>
         */}
        <div className="flex flex-col gap-2 ">
          {user ? (
            <div className="flex items-center gap-4">
              <DeleteDialog
                queryKey={QUERY_KEYS.ALL_PERSONS}
                type="person"
                path="/dashboard/persons"
              />
              <Link href={"/dashboard/persons/edit/" + person?.id}>
                <Button variant={"outline"}>
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </Button>
              </Link>
            </div>
          ) : null}
          <p className="text-sm">
            Last Modified by : {person?.lastModifiedBy?.username || "N/A"}
          </p>
          <p className="text-sm">
            Created by : {person?.createdBy?.username || "N/A"}
          </p>
        </div>
      </div>

      <div className="grid gap-2 grid-cols-1 md:grid-cols-2 mt-5">
        <div className="relative w-full h-56 md:w-auto md:h-auto overflow-hidden">
          <Image
            src={person?.images[0]?.url || "/profile.png"}
            alt={person.fullName || "Profile Image"}
            fill
            className="sm:max-w-96 sm:max-h-96 md:mx-auto rounded-md"
          />
        </div>
        <div className="flex flex-col gap-3">
          {renderLabelValuePair("Title", person?.title)}
          {renderLabelValuePair("Username", person?.username)}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            {renderLabelValuePair("FirstName", person?.fname)}
            {renderLabelValuePair("MiddleName", person?.mname)}
            {renderLabelValuePair("LastName", person?.lname)}
          </div>
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-5">
            {renderLabelValuePair("Country", person?.country)}
            {renderLabelValuePair("State", person?.state)}
            {renderLabelValuePair("City", person?.city)}
          </div>
          {renderLabelValuePair("Address1", person?.address)}
          {renderLabelValuePair("Address2", person?.address2)}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-5">
            {renderLabelValuePair("Type", person?.type)}
            {renderLabelValuePair("Source", person?.source)}
            {user &&
              renderLabelValuePair(
                "Date of Birth",
                new Date(person.DOB!).toLocaleDateString()
              )}

            {renderLabelValuePair(
              "Age",
              String(calculateAge(new Date(person.DOB!)))
            )}
          </div>
        </div>
      </div>
      <Separator className="my-5" />
      <div className="text-accent-foreground  mb-10">
        <h3 className="text-md font-semibold">
          Incidents :{" "}
          <span className="text-sm text-muted-foreground">
            {person.incidents?.length}
          </span>{" "}
        </h3>
        <div className="flex flex-col gap-4 md:flex-nowrap text-muted-foreground text-xs md:text-sm">
          {person?.incidents?.map((incident, i) => (
            <div key={incident.id + i} className="flex gap-2 items-start">
              <span>{renderLabelValuePair("Title", incident.title)}</span>
              <span>
                {renderLabelValuePair(
                  "date",
                  new Date(incident.date).toLocaleDateString()
                )}
              </span>
              <span>{renderLabelValuePair("Type", incident.type)}</span>
            </div>
          ))}
        </div>
      </div>
      <Separator className="my-5" />
      <div className="text-accent-foreground  mb-10">
        <h3 className="text-md font-semibold">Notes</h3>
        <p className="leading-4 ">{person?.notes || "N/A"}</p>
      </div>
      <Separator className="my-5" />
      <div className="text-accent-foreground  mb-10">
        <h3 className="text-md font-semibold">Socials</h3>
        <div className="flex items-center flex-wrap gap-4">
          {person?.social?.length ? (
            person?.social?.map((social, i) => (
              <div key={social?.id + i}>
                <div
                  key={social.id}
                  className="flex flex-row items-center gap-2"
                >
                  <h1 className="text-md font-semibold">
                    Platform:{" "}
                    <span className="font-normal text-muted-foreground">
                      {social.platform}
                    </span>
                  </h1>
                  <h1 className="text-md font-semibold">
                    Account:{" "}
                    <span className="font-normal text-muted-foreground">
                      {social.account}
                    </span>
                  </h1>
                </div>
                <Separator orientation="vertical" />
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No socials available</p>
          )}
        </div>
      </div>
      <ShowImages images={person?.images || []} />
    </div>
  );
};

export default page;
