
import { AddSchool } from "@/components/dashboard/schools/AddSchool";

const page = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-center font-semibold text-3xl">Add School</h1>

      <br />
      <AddSchool />
      <br />
    </div>
  );
};

export default page;
