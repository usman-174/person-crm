import { getOrganization } from "@/actions/organization";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { EditOrganization } from "@/components/dashboard/organizations/EditOrganization";
import { ORGANIZATION } from "@/types/COMMON";

import { getServerSession } from "next-auth";
type props = {
  params: {
    id: string;
  };
};

const page = async ({ params }: props) => {
  const session = await getServerSession(authOptions);
  let organization: ORGANIZATION | null = null;
  if (session?.user) {
    organization = await getOrganization(params.id, session?.user.token);
  }
  if (!organization) return null;

  return (
    <div className=" mx-auto">
      <h1 className="text-center font-semibold text-3xl">Edit Organization</h1>

      <br />
      <EditOrganization organization={organization} />
    </div>
  );
};

export default page;
