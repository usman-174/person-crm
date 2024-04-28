
import { AddPerson } from "@/components/dashboard/persons/AddPerson";
import React from "react";

const page = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-center font-semibold text-3xl">Add Person</h1>

      <br />
      <AddPerson />
    </div>
  );
};

export default page;
