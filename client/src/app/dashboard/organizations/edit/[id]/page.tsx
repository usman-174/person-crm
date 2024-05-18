import { getOrganization } from "@/actions/organization";
import { EditOrganization } from "@/components/dashboard/organizations/EditOrganization";
import { ORGANIZATION } from "@/types/COMMON";

type props = {
  params: {
    id: string;
  };
};

const page = async ({ params }: props) => {
 
  let organization: ORGANIZATION | null = null;

    organization = await getOrganization(params.id);
  
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
