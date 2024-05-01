import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Organizations from "@/components/dashboard/organizations/Organizations";

import { getServerSession } from "next-auth";

const page = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return (
    <div className="container">
      <h1 className="text-center text-3xl font-semibold">Organizations</h1>
      <br />

      <Organizations user={user} />
    </div>
  );
};

export default page;
