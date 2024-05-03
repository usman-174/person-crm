import { getIncident } from "@/actions/incident";
import { EditIncident } from "@/components/dashboard/incidents/EditIncident";
import { INCIDENT } from "@/types/COMMON";
import { authOptions } from "@/utils/authOptions";

import { getServerSession } from "next-auth";
type props = {
  params: {
    id: string;
  };
};

const page = async ({ params }: props) => {
  const session = await getServerSession(authOptions);
  let incident: INCIDENT | null = null;
  if (session?.user) {
    incident = await getIncident(params.id, session?.user.token);
  }
  if (!incident) return null;

  return (
    <div className=" mx-auto">
      <h1 className="text-center font-semibold text-3xl">Edit Incident</h1>

      <br />
      <EditIncident incident={incident} />
    </div>
  );
};

export default page;
