import { getAllSchoolCities, getAllSchoolStates } from "@/actions/school";
import Schools from "@/components/dashboard/schools/Schools";
import { Suspense } from "react";

const page = async () => {

  const [cities, states] = await Promise.all([
    getAllSchoolCities(),
    getAllSchoolStates(),
  ]);

  return (
    <div className="container">
      <h1 className="text-center text-3xl font-semibold">Schools</h1>
      <br />
      <Suspense>
        <Schools   cities={cities as string[]} states={states as string[]}/> 
      </Suspense>
    </div>
  );
};

export default page;
