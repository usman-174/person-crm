import { getIncident } from "@/actions/incident";
import { EditIncident } from "@/components/dashboard/incidents/EditIncident";
import { INCIDENT } from "@/types/COMMON";

type props = {
  params: {
    id: string;
  };
};

const page = async ({ params }: props) => {
  let incident: INCIDENT | null = await getIncident(params.id);

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
