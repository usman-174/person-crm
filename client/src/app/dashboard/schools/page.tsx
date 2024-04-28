import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Persons from "@/components/dashboard/persons/Persons";

import { getServerSession } from "next-auth";
import React from "react";

const page = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return (
    <div className="container">
      <h1 className="text-center text-3xl font-semibold">Schools</h1>
      <br />

      <Persons user={user} />
    </div>
  );
};

export default page;
