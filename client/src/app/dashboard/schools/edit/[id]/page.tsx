import { getSchool } from "@/actions/school";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { EditSchool } from "@/components/dashboard/schools/EditSchool";
import { SCHOOL } from "@/types/COMMON";

import { getServerSession } from "next-auth";
type props = {
  params: {
    id: string;
  };
};

const page = async ({ params }: props) => {
  const session = await getServerSession(authOptions);
  let school: SCHOOL | null = null;
  if (session?.user) {
    school = await getSchool(params.id, session?.user.token);
  }
  if (!school) return null;

  return (
    <div className=" mx-auto">
      <h1 className="text-center font-semibold text-3xl">Edit School</h1>

      <br />
      <EditSchool school={school} />
    </div>
  );
};

export default page;
