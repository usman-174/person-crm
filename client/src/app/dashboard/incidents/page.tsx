import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Incidents from "@/components/dashboard/incidents/Incidents";
import Schools from "@/components/dashboard/schools/Schools";

import { getServerSession } from "next-auth";

const page = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return (
    <div className="container">
      <h1 className="text-center text-3xl font-semibold">Incidents</h1>
      <br />

      <Incidents user={user} />
    </div>
  );
};

export default page;