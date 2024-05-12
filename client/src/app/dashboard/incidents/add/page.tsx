import { AddIncidents } from "@/components/dashboard/incidents/AddIncident";

const page = () => {
 
  
  return (
    <div className="container mx-auto">
      <h1 className="text-center font-semibold text-3xl">Add Incident</h1>

      <br />
      <AddIncidents  />
      <br />
      <br />
    </div>
  );
};

export default page;
