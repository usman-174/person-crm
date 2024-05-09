import { getPerson } from "@/actions/person";
import { EditPerson } from "@/components/dashboard/persons/EditPerson";
import { PERSON } from "@/types/COMMON";
type props = {
  params: {
    id: string;
  };
};

const page = async ({ params }: props) => {
 
  let person: PERSON | null = null;
  
    person = await getPerson(params.id);
  
  if (!person) return null;
  
  
  return (
    <div className=" mx-auto">
      <h1 className="text-center font-semibold text-3xl">Edit Person</h1>

      <br />
      <EditPerson person={person} />
     
    </div>
  );
};

export default page;
