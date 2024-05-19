import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { PERSON, Social } from "@/types/COMMON";
import Image from "next/image";

import { formatDistance } from "date-fns";
import Link from "next/link";
type Props = {
  person: PERSON;
};

type GroupedSocials = {
  [platform: string]: Social[];
};

const PersonCard = ({ person }: Props) => {
  const socials = person.social || [];

  const groupedByPlatform: GroupedSocials = socials.reduce<GroupedSocials>(
    (acc, social) => {
      if (!acc[social.platform]) {
        acc[social.platform] = [];
      }
      acc[social.platform].push(social);
      return acc;
    },
    {}
  );

  return (
    <Card className="flex flex-col justify-between">
      <CardContent>
        <div className="flex items-center justify-start gap-2 mt-3">
          <Image
            src={person?.images[0]?.url || "/profile.png"}
            alt={person.fullName || "Profile Image"}
            width={80}
            height={80}
            className="rounded-sm w-20  aspect-square border shadow  "
          />
          <div className="flex gap-1 flex-col items-start justify-start">
            <h1 className="text-sm md:text-lg font-semibold break-all">
              {person.fullName}
            </h1>
            <span className="text-muted-foreground text-xs md:text-sm">
              {person.city}  {person.state ? ", "+person.state:null}
            </span>
          </div>
        </div>
        <div className="flex flex-col  mt-3">
          {Object.entries(groupedByPlatform).map(([platform, links]) => (
            <div key={platform} className="flex gap-2">
              <Link href={links[0].account} target="_blank">
                <span className="text-xs text-muted-foreground cursor-pointer">
                  {platform}
                  {links.length > 1 && ` + ${links.length - 1} more`}
                </span>
              </Link>
            </div>
          ))}
        </div>
        <br />
        <div className="flex flex-col gap-2 ">
          {person.incidents?.length ? (
            <span className="text-xs ">
              {person.incidents?.length} Incidents
            </span>
          ) : null}
          {person.organizations?.length ? (
            <span className="text-xs ">
              Organizations: {person.organizations[0].name}{" "}
              {person.organizations.length > 1 ? "+ 2 others" : null}
            </span>
          ) : null}
          {person.schools?.length ? (
            <span className="text-xs ">
              Schools: {person.schools[0].name}{" "}
              {person.schools.length > 1 ? "+ 2 others" : null}
            </span>
          ) : null}
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
