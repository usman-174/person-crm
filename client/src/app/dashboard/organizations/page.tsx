import Organizations from "@/components/dashboard/organizations/Organizations";
import { Suspense } from "react";

import { getAllOrganizationCities, getAllOrganizationStates } from "@/actions/organization";

const page = async () => {
  let [cities, states] = await Promise.all([
    getAllOrganizationCities(),
    getAllOrganizationStates(),
  ]);

  return (
    <div className="">
      <h1 className="text-center text-3xl font-semibold">Organizations</h1>
      <br />

      <Suspense>
      <Organizations  cities={cities as string[]} states={states as string[]}/>
      </Suspense>
    </div>
  );
};

export default page;
