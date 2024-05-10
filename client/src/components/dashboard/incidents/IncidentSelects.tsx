import * as React from "react";

import { QUERY_KEYS, REAVALIDAION_TIME } from "@/actions/contants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ORGANIZATION, PERSON, SCHOOL } from "@/types/COMMON";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Check } from "lucide-react";

export function IncidentSelects({ form }: { form: any }) {
  const [personIds, setPersonIds] = React.useState<string[]>(
    form.getValues().personIds || []
  );
  const [schoolIds, setSchoolIds] = React.useState<string[]>(
    form.getValues().schoolIds || []
  );
  const [organizationIds, setOrganizationIds] = React.useState<string[]>([
    ...form.getValues().organizationIds || [],
  ]);
 

  const [searchPeronQuery, setSearchPeronQuery] = React.useState<string>("");
  const [searchSchoolQuery, setSearchSchoolQuery] = React.useState<string>("");
  const [searchOrganizationQuery, setSearchOrganizationQuery] =
    React.useState<String>("");

  const addPersonId = (id: string) => {
    //only add if donot exist
    if (!personIds.includes(id)) {
      setPersonIds([...personIds, id]);
      form.setValue("personIds", [...form.getValues().personIds!, id]);
    } else {
      //remove
      setPersonIds(personIds.filter((personId) => personId !== id));
      form.setValue(
        "personIds",
        form
          .getValues()
          .personIds?.filter((personOd: string) => personOd !== id)
      );
    }
  };
  const addSchoolId = (id: string) => {
    //only add if donot exist
    if (!schoolIds.includes(id)) {
      setSchoolIds([...schoolIds, id]);
      form.setValue("schoolIds", [...form.getValues().schoolIds!, id]);
    } else {
      //remove
      setSchoolIds(schoolIds.filter((schoolId) => schoolId !== id));
      form.setValue(
        "schoolIds",
        form
          .getValues()
          .schoolIds?.filter((schoolId: string) => schoolId !== id)
      );
    }
  };
  const addOrganizationId = (id: string) => {
    //only add if donot exist
    if (!organizationIds.includes(id)) {
      setOrganizationIds([...organizationIds, id]);
      form.setValue("organizationIds", [
        ...form.getValues().organizationIds!,
        id,
      ]);
    } else {
      //remove
      setOrganizationIds(
        organizationIds.filter((organizationId) => organizationId !== id)
      );
      form.setValue(
        "organizationIds",
        form
          .getValues()
          .organizationIds?.filter(
            (organizationId: string) => organizationId !== id
          )
      );
    }
  };

  const { data: persons } = useQuery({
    queryKey: [QUERY_KEYS.ALL_PERSONS],
    queryFn: async () => {
      const { data } = await axios.get(`/api/${REAVALIDAION_TIME.PERSON.type}`);
      return data;
    },
  });
  const { data: schools } = useQuery({
    queryKey: [QUERY_KEYS.ALL_SCHOOLS],
    queryFn: async () => {
      const { data } = await axios.get(`/api/${REAVALIDAION_TIME.SCHOOL.type}`);
      return data;
    },
  });
  const { data: organizations } = useQuery({
    queryKey: [QUERY_KEYS.ALL_ORGANIZATIONS],
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/${REAVALIDAION_TIME.ORGANIZATION.type}`
      );
      return data;
    },
  });

  const filteredPersons: PERSON[] = persons?.filter((person: PERSON) =>
    (person?.fullName || person?.fname + " " + person?.lname)
      ?.toLowerCase()
      .includes(searchPeronQuery.toLowerCase())
  );
  const filteredSchools: SCHOOL[] = schools?.filter((school: SCHOOL) =>
    school.name.toLowerCase().includes(searchSchoolQuery.toLowerCase())
  );
  const filteredOrganizations: ORGANIZATION[] = organizations?.filter(
    (organization: ORGANIZATION) =>
      organization.name
        .toLowerCase()
        .includes(searchOrganizationQuery.toLowerCase())
  );

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    set: any
  ) => {
    set(event.target.value);
  };
  
  return (
    <div className="flex  flex-wrap md:flex-nowrap md:items-start md:justify-start gap-10">
      <div>
        <div className="max-w-80 min-w-64 items-center gap-1.5">
          <Label htmlFor="person">Search Persons</Label>
          <Input
            type="text"
            id="person"
            placeholder="Person name"
            value={searchPeronQuery}
            onChange={(e) => handleChange(e, setSearchPeronQuery)}
            autoComplete="off"
          />
        </div>
        <ScrollArea className="h-auto max-w-80 min-w-64 rounded-md border mt-1">
          <div className="py-2 px-1">
            {/* <h4 className="mb-4 text-sm font-medium leading-none">Persons</h4> */}
            {filteredPersons?.map((person, i) => (
              <div
                key={person.id}
                onClick={() => addPersonId(person.id)}
                className="hover:bg-gray-100 cursor-pointer  px-2 py-1 rounded-md transition-colors"
              >
                <span className="text-sm truncate flex overflow-hidden">
                  {personIds?.includes(person.id) ? (
                    <Check className="w-4 h-4 mr-2" />
                  ) : null}{" "}
                  {person?.fullName || person?.fname + " " + person?.lname}
                </span>

                <Separator className="my-1" />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      <div>
        <div className="max-w-80 min-w-64 items-center gap-1.5">
          <Label htmlFor="school">Search Schools</Label>
          <Input
            type="text"
            id="school"
            placeholder="School name"
            value={searchSchoolQuery}
            onChange={(e) => handleChange(e, setSearchSchoolQuery)}
            autoComplete="off"
          />
        </div>
        <ScrollArea className="h-auto max-w-80 min-w-64 rounded-md border mt-1">
          <div className="py-2 px-1">
            {/* <h4 className="mb-4 text-sm font-medium leading-none">Persons</h4> */}
            {filteredSchools?.map((school, i) => (
              <div
                key={school.id}
                onClick={() => addSchoolId(school.id)}
                className="hover:bg-gray-100 cursor-pointer  px-2 py-1 rounded-md transition-colors"
              >
                <span className="text-sm truncate flex overflow-hidden">
                  {schoolIds?.includes(school.id) ? (
                    <Check className="w-4 h-4 mr-2" />
                  ) : null}{" "}
                  {school.name}
                </span>

                <Separator className="my-1" />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      <div>
        <div className="max-w-80 min-w-64 items-center gap-1.5">
          <Label htmlFor="org">Search Oraganization</Label>
          <Input
            type="text"
            id="org"
            placeholder="Organization name"
            value={searchOrganizationQuery as any}
            onChange={(e) => handleChange(e, setSearchOrganizationQuery)}
            autoComplete="off"
          />
        </div>
        <ScrollArea className="h-auto max-w-80 min-w-64 rounded-md border mt-1">
          <div className="py-2 px-1">
            {/* <h4 className="mb-4 text-sm font-medium leading-none">Persons</h4> */}
            {filteredOrganizations?.map((org, i) => (
              <div
                key={org.id}
                onClick={() => addOrganizationId(org.id)}
                className="hover:bg-gray-100 cursor-pointer  px-2 py-1 rounded-md transition-colors"
              >
                <span className="text-sm truncate flex overflow-hidden break-all">
                  {organizationIds.includes(org.id) ? (
                    <Check className="w-4 h-4 mr-2" />
                  ) : null}{" "}
                  {org.name}
                </span>

                <Separator className="my-1" />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
