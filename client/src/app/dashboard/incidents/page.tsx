import { getAllIncidentCities, getAllIncidentStates } from "@/actions/incident";
import Incidents from "@/components/dashboard/incidents/Incidents";
import { Suspense } from "react";
const page = async () => {
  let [cities, states] = await Promise.all([
    getAllIncidentCities(),
    getAllIncidentStates(),
  ]);

 
  return (
    <div className="">
      <h1 className="text-center text-3xl font-semibold">Incidents</h1>
      <br />

      <Suspense>
        <Incidents cities={cities as string[]} states={states as string[]} />
      </Suspense>
    </div>
  );
};

export default page;
