import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { PERSON } from "@/types/COMMON";
import Image from "next/image";

import { formatDistance } from "date-fns";
import Link from "next/link";
type Props = {
  person: PERSON;
};

const PersonCard = ({ person }: Props) => {
  return (
    <Card className="flex flex-col justify-between">
      <CardContent>
        <div className="flex items-center justify-start gap-2 mt-3">
          <Image
            src={person?.images[0]?.url || "/profile.png"}
            alt={person.fullName || "Profile Image"}
            width={80}
            height={80}
            className="rounded-sm w-20  aspect-square "
          />
          <div className="flex gap-1 flex-col items-start justify-start">
            <h1 className="text-sm md:text-lg font-semibold break-all">
              {person.fullName}
            </h1>
            <span className="text-muted-foreground text-xs md:text-sm">
              {person.city} , {person.state}
            </span>
          </div>
        </div>
        <br />
        <div className="flex flex-col gap-2">
          <span className="text-sm ">
            No. of Organizations: {person.organizations?.length}
          </span>
          <span className="text-sm ">
            No. of Incidents: {person.incidents?.length}
          </span>
          {/* <div className="flex flex-col items-start gap-3">
          {person.incidents?.slice(0, 2).map((incident,i) => (
            <Link key={incident.id+i} href={"/dashboard/incidents/"+incident.id}>
            <div >
              <div className="text-accent-foreground uppercase cursor-pointer text-xs md:text-sm">
                {incident.title}
              </div>
              
            </div>
            </Link>
          ))}
        </div> */}
        </div>
        <div className="flex flex-col gap-2 mt-3">
          {person.social?.map((social, i) => (
            <div key={social.id + i} className="flex gap-2">
              <span className="text-xs text-muted-foreground cursor-pointer">
                {social.platform}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
      <br />
      <CardFooter className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">
            CreatedAt :{" "}
            {formatDistance(
              new Date(person.createdAt),

              new Date(),
              { addSuffix: true }
            )}
          </span>
          <span className="text-xs text-muted-foreground">
            Modified :{" "}
            {formatDistance(
              new Date(person.lastModified),

              new Date(),
              { addSuffix: true }
            )}
          </span>
        </div>
        <Link href={`/dashboard/persons/${person.id}`}>
          <Button variant={"outline"} className="bg-background ml-auto ">
            Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PersonCard;
