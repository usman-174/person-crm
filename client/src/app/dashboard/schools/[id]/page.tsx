import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Separator } from "@/components/ui/separator";
import { getServerSession } from "next-auth";

import { QUERY_KEYS } from "@/actions/contants";
import { getSchool } from "@/actions/school";
import { Button } from "@/components/ui/button";
import { SCHOOL } from "@/types/COMMON";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { DeleteDialog } from "@/components/dashboard/DeleteDialog";
type props = {
  params: {
    id: string;
  };
};

const page = async ({ params }: props) => {
  const session = await getServerSession(authOptions);
  let school: SCHOOL | null = null;
  if (session?.user) {
    school = await getSchool(params.id, session?.user.token);
  }
  if (!school) return null;

  return (
    <div className="container mx-auto">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-semibold text-3xl">{school?.name} </h1>
          <p className="text-muted-foreground text-sm">
            {new Date(school.createdAt!).toLocaleDateString()}
          </p>
          <p className="text-accent-foreground text-sm mt-4">{school?.id}</p>
        </div>
        {/* <OptionsDropDown/>
         */}
        <div className="flex flex-col gap-2 ">
          <div className="flex items-center gap-4">
            <DeleteDialog queryKey={QUERY_KEYS.ALL_SCHOOLS} type="school"
            path="/dashboard/schools" />
            
            <Link href={"/dashboard/schools/edit/" + school?.id}>
              <Button variant={"outline"}>
                <Pencil className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </Button>
            </Link>
          </div>
          <p className="text-sm">
            Last Modified by : {school?.lastModifiedBy?.username || "N/A"}
          </p>
          <p className="text-sm">
            Created by : {school?.createdBy?.username || "N/A"}
          </p>
        </div>
      </div>

      <div className="grid gap-2 grid-cols-1 md:grid-cols-2  mt-5">
        {/* <div className="relative w-full h-56 md:w-auto md:h-auto overflow-hidden">
          <Image
            src={
              school?.mainPhoto ||
              "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" ||
              "/profile.png"
            }
            alt={school.fullName!}
            fill
            className="sm:max-w-96 sm:max-h-96 md:mx-auto rounded-md"
          />
        </div> */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-5">
            <div>
              <h1 className="text-md font-semibold">Head</h1>
              <p className="text-muted-foreground text-sm">
                {school?.head?.name || "N/A"}
              </p>
            </div>
            <div>
              <h1 className="text-md font-semibold">Gender</h1>
              <p className="text-muted-foreground text-sm">
                {school?.head?.gender || "N/A"}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <div>
              <h1 className="text-md font-semibold">Organization</h1>
              <p className="text-muted-foreground text-sm">
                {school?.organization?.name || "N/A"}
              </p>
            </div>
            <div>
              <h1 className="text-md font-semibold">Org's state</h1>
              <p className="text-muted-foreground text-sm">
                {school?.state || "N/A"}
              </p>
            </div>
            <div>
              <h1 className="text-md font-semibold">Org's City</h1>
              <p className="text-muted-foreground text-sm">
                {school?.city || "N/A"}
              </p>
            </div>
          </div>
          {/* <div className="flex flex-wrap sm:flex-nowrap items-center gap-5">
            <div>
              <h1 className="text-md font-semibold">Country</h1>
              <p className="text-muted-foreground text-sm">
                {school?.country || "N/A"}
              </p>
            </div>
            <div>
              <h1 className="text-md font-semibold">State</h1>
              <p className="text-muted-foreground text-sm">
                {school?.state || "N/A"}
              </p>
            </div>
            <div>
              <h1 className="text-md font-semibold">City</h1>
              <p className="text-muted-foreground text-sm">
                {school?.city || "N/A"}
              </p>
            </div>
          </div>
          <div>
            <h1 className="text-md font-semibold">Address1</h1>
            <p className="text-muted-foreground text-sm">
              {school?.address || "N/A"}
            </p>
          </div>
          <div>
            <h1 className="text-md font-semibold">Address2</h1>
            <p className="text-muted-foreground text-sm">
              {school?.address2 || "N/A"}
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-5">
            <div>
              <h1 className="text-md font-semibold">Type</h1>
              <p className="text-accent-foreground text-sm">
                {school?.type || "N/A"}
              </p>
            </div>
            <div>
              <h1 className="text-md font-semibold">Source</h1>
              <p className="text-accent-foreground text-sm">
                {school?.source || "N/A"}
              </p>
            </div>
            <div>
              <h1 className="text-md font-semibold">Date of Birth</h1>
              <p className="text-muted-foreground text-sm">
                {new Date(school.DOB!).toLocaleDateString() || "N/A"}
              </p>
            </div>
          </div> */}
        </div>
      </div>
      <Separator className="my-5" />
      <div className="text-accent-foreground md:mx-10 mb-10">
        <h3 className="text-md font-semibold">Notes</h3>
        <p className="leading-4 ">{school?.notes || "N/A"}</p>
      </div>
      <Separator className="my-5" />
      {/* <div className="text-accent-foreground md:mx-10 mb-10">
        <h3 className="text-md font-semibold">Socials</h3>
        <div className="flex items-center flex-wrap gap-4">
          {school?.social?.length ? (
            school?.social?.map((social) => (
              <>
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
              </>
            ))
          ) : (
            <p className="text-muted-foreground">No socials available</p>
          )}
        </div>
      </div> */}
    </div>
  );
};

export default page;
