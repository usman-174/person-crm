import { Separator } from "@/components/ui/separator";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";

import { QUERY_KEYS, REAVALIDAION_TIME } from "@/actions/contants";
import { getOrganization } from "@/actions/organization";
import { DeleteDialog } from "@/components/dashboard/DeleteDialog";
import ShowImages from "@/components/dashboard/ShowImages";
import { Button } from "@/components/ui/button";
import { ORGANIZATION } from "@/types/COMMON";
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
  let organization: ORGANIZATION | null = await getOrganization(params.id);

  if (!organization) return null;
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return (
    <div>
      <div className="flex md:items-start md:justify-between flex-col-reverse md:flex-row">
        <div>
          <h1 className="font-semibold text-3xl  mt-10 md:mt-0">
            {organization.name}{" "}
          </h1>
          <p className="text-muted-foreground text-sm">
            {new Date(organization.createdAt!).toLocaleDateString()}
          </p>
          <p className="text-accent-foreground text-sm mt-4">
            {organization.id}
          </p>
        </div>

        <div className="flex flex-col gap-2 ">
          {user ? (
            <div className="flex items-center gap-4">
              <DeleteDialog
                queryKey={QUERY_KEYS.ALL_ORGANIZATIONS}
                type={REAVALIDAION_TIME.ORGANIZATION.type}
                path="/dashboard/organizations"
              />

              <Link href={"/dashboard/organizations/edit/" + organization.id}>
                <Button variant={"outline"}>
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </Button>
              </Link>
            </div>
          ) : null}
          <p className="text-sm">
            Last Modified by : {organization.lastModifiedBy?.username || "N/A"}
          </p>
          <p className="text-sm">
            Created by : {organization.createdBy?.username || "N/A"}
          </p>
        </div>
      </div>

      <div className="">
        <div className="flex flex-col gap-1">
          <p className=" flex flex-wrap gap-4 md:flex-nowrap text-muted-foreground text-xs md:text-sm my-3">
            {renderLabelValuePair("City", organization.city)}
            {renderLabelValuePair("State", organization.state)}
            {renderLabelValuePair("Country", organization.country)}
          </p>

         
        
          <div className="mt-2">
            <h1 className="text-md font-semibold">
              Schools :{" "}
              <span className="text-sm text-muted-foreground">
                {organization.schools.length}
              </span>
            </h1>
            <div className="flex flex-wrap md:flex-nowrap flex-row  items-center gap-4 ">
              {organization.schools?.map((school) => (
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
                  <div>
                    <h1 className="text-md font-semibold">State</h1>
                    <p className="text-muted-foreground text-sm">
                      {school.country || "N/A"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Separator className="my-3" />
          <div>
            <h1 className="text-md font-semibold">
              Heads :{" "}
              <span className="text-sm text-muted-foreground">
                {organization.heads.length}
              </span>
            </h1>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-8">
              {organization.heads?.map((head) => (
                <div key={head.id} className="p-2">
                  <div>
                    <p className="text-muted-foreground text-md uppercase">
                      {head.fullName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <h1 className="text-md font-semibold">
                      <p className="text-muted-foreground text-sm">
                        {head?.source || "N/A"}
                      </p>
                    </h1>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {organization?.notes ? (
        <>
          <Separator className="my-5" />
          <div className="text-accent-foreground  mb-10">
            <h3 className="text-md font-semibold">Notes</h3>
            <p className="leading-4 mx-3">{organization?.notes || "N/A"}</p>
          </div>
        </>
      ) : null}
      <Separator className="my-5" />
      <ShowImages images={organization?.images || []} />
    </div>
  );
};

export default page;
