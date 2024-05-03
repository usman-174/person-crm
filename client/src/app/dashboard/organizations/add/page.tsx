import { AddOrganization } from "@/components/dashboard/organizations/AddOrganization";

const page = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-center font-semibold text-3xl">Add Organization</h1>

      <br />
      <AddOrganization />
      <br />    </div>
  );
};

export default page;
