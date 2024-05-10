import { getAllPersons } from "@/actions/person";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { PERSON } from "@/types/COMMON";
import { authOptions } from "@/utils/authOptions";
import { formatDistance } from "date-fns";
import { Plus } from "lucide-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const persons: PERSON[] = await getAllPersons();
  const session = await getServerSession(authOptions);
  if (!persons) return <div>loading...</div>;
  const user = session?.user;

  return (
    <div className="sm:container mx-auto mt-10">
      <h1 className="text-center text-3xl font-semibold mb-10">Persons CRM</h1>
    {user?.role==="ADMIN"?  <div className="text-right w-full">
        <Link href={"/dashboard/persons/add"}>
          <Button variant={"link"} className="text-lg">
            <Plus size={"25"} />
            Add Peron
          </Button>
        </Link>
      </div>:null}
      {persons?.length ? (
        <div className="grid grid-cols-1 gap-2 justify-items-stretch sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 mt-10 mx-auto">
          {persons?.map((person,i) => (
           <Card key={person.id + i} className="flex flex-col justify-between">
           <CardContent>
             <div className="flex items-center justify-start gap-2 mt-3">
               <Image
                 src={
                   person?.mainPhoto ||
                   "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" ||
                   "/profile.png"
                 }
                 alt={person.fullName || "Profile Image"}
                 width={80}
                 height={80}
                 className="rounded-sm w-20  aspect-square "
               />
               <div className="flex gap-1 flex-col items-start justify-start">
                 <h1 className="text-sm md:text-lg font-semibold break-all">
                   {person.fullName}
                 </h1>
                 <span className="text-muted-foreground text-xs md:text-sm">
                   {person.city} , {person.state}
                 </span>
               </div>
             </div>
             <br />
             <div className="flex flex-col gap-2">
               <span className="text-sm ">
                 No. of Organizations: {person.organizations?.length}
               </span>
               <span className="text-sm ">
                 No. of Incidents: {person.incidents?.length}
               </span>
               {/* <div className="flex flex-col items-start gap-3">
                 {person.incidents?.slice(0, 2).map((incident,i) => (
                   <Link key={incident.id+i} href={"/dashboard/incidents/"+incident.id}>
                   <div >
                     <div className="text-accent-foreground uppercase cursor-pointer text-xs md:text-sm">
                       {incident.title}
                     </div>
                     
                   </div>
                   </Link>
                 ))}
               </div> */}
             </div>
             <div className="flex flex-col gap-2 mt-3">
               {person.social?.map((social, i) => (
                 <div key={social.id + i} className="flex gap-2">
                   <span className="text-xs text-muted-foreground cursor-pointer">
                     {social.platform}
                   </span>
                 </div>
               ))}
             </div>
           </CardContent>
           <br />
           <CardFooter className="flex items-center justify-between">
             <div className="flex flex-col gap-1">

             <span className="text-xs text-muted-foreground">
               CreatedAt :{" "}
               {formatDistance(
                 new Date(person.createdAt),
                 
                 new Date(),
                 { addSuffix: true }
               )}
             </span>
             <span className="text-xs text-muted-foreground">
               Modified :{" "}
               {formatDistance(
                 new Date(person.lastModified),
                 
                 new Date(),
                 { addSuffix: true }
               )}
             </span>
               </div>
             <Link href={`/dashboard/persons/${person.id}`}>
               <Button
                 variant={"outline"}
                 className="bg-background ml-auto "
               >
                 Details
               </Button>
             </Link>
           </CardFooter>
         </Card>
          ))}
        </div>
      ) : (
        <div className="text-center text-2xl font-semibold">
          No Persons Found
        </div>
      )}
    </div>
  );
}
