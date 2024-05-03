
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import { authOptions } from "@/utils/authOptions";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);

  if (session?.user) redirect("/");
  return (
    <div>
      {" "}
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    </div>
  );
};

export default layout;
