import Organizations from "@/components/dashboard/organizations/Organizations";
import { Suspense } from "react";


const page = async () => {
  
  return (
    <div className="">
      <h1 className="text-center text-3xl font-semibold">Organizations</h1>
      <br />

      <Suspense>
      <Organizations />
      </Suspense>
    </div>
  );
};

export default page;
