import { getSchool } from "@/actions/school";
import { EditSchool } from "@/components/dashboard/schools/EditSchool";
import { SCHOOL } from "@/types/COMMON";
import { authOptions } from "@/utils/authOptions";

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
    school = await getSchool(params.id);
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
