import { Separator } from "@/components/ui/separator";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";

import { QUERY_KEYS } from "@/actions/contants";
import { getSchool } from "@/actions/school";
import { DeleteDialog } from "@/components/dashboard/DeleteDialog";
import ShowImages from "@/components/dashboard/ShowImages";
import { Button } from "@/components/ui/button";
import { SCHOOL } from "@/types/COMMON";
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
  const session = await getServerSession(authOptions);
  const user = session?.user;

  let school: SCHOOL | null = await getSchool(params.id);

  if (!school) return null;

  return (
    <div>
      <div className="flex md:items-start md:justify-between flex-col-reverse md:flex-row">
        <div>
          <h1 className="font-semibold text-3xl mt-5 md:mt-0">
            {school?.name}{" "}
          </h1>
          <p className="text-muted-foreground text-sm">
            {new Date(school.createdAt!).toLocaleDateString()}
          </p>
          <p className="text-accent-foreground text-sm mt-4">{school?.id}</p>
        </div>
        {/* <OptionsDropDown/>
         */}
        <div className="flex flex-col gap-2 ">
          {user ? (
            <div className="flex items-center gap-4">
              <DeleteDialog
                queryKey={QUERY_KEYS.ALL_SCHOOLS}
                type="school"
                path="/dashboard/schools"
              />

              <Link href={"/dashboard/schools/edit/" + school?.id}>
                <Button variant={"outline"}>
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </Button>
              </Link>
            </div>
          ) : null}
          <p className="text-sm">
            Last Modified by : {school?.lastModifiedBy?.username || "N/A"}
          </p>
          <p className="text-sm">
            Created by : {school?.createdBy?.username || "N/A"}
          </p>
        </div>
      </div>

      <div className=" mt-5">
        <div className="flex flex-col gap-3">
          <div className="">
            <h1 className="text-md font-semibold">
              Heads :{" "}
              <span className="text-sm text-muted-foreground">
                {school.heads.length}
              </span>
            </h1>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-8">
              {school.heads?.map((head) => (
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
          <Separator className="" />

          <div className="">
            <h1 className="text-md font-semibold">Organization: </h1>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 mx-3">
              {renderLabelValuePair("Name", school?.organization?.name)}
              {renderLabelValuePair("City", school?.city)}
              {renderLabelValuePair("State", school?.state)}
              {renderLabelValuePair("Country", school?.country)}
            </div>
          </div>
        </div>
      </div>
      {school?.notes ? (
        <>
          <Separator className="my-5" />
          <div className="text-accent-foreground  mb-10">
            <h3 className="text-md font-semibold">Notes</h3>
            <p className="leading-4 ">{school?.notes || "N/A"}</p>
          </div>
        </>
      ) : null}
      <Separator className="my-5" />
      <ShowImages images={school?.images || []} />
    </div>
  );
};

export default page;
