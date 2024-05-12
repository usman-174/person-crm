import Persons from "@/components/dashboard/persons/Persons";
import { Suspense } from "react";

const page = async () => {

 
  return (
    <div className="">
     
      <h1 className="text-center text-3xl font-semibold">Persons</h1>
      <br />

      <Suspense>
      <Persons   />
      </Suspense>
    </div>
  );
};

export default page;
