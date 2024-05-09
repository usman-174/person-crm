import Incidents from "@/components/dashboard/incidents/Incidents";


const page = async () => {
 

  return (
    <div className="container">
      <h1 className="text-center text-3xl font-semibold">Incidents</h1>
      <br />

      <Incidents />
    </div>
  );
};

export default page;
