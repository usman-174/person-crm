import * as React from "react";

import { QUERY_KEYS, REAVALIDAION_TIME } from "@/actions/contants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { PERSON } from "@/types/COMMON";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Check } from "lucide-react";

export function SelectHeads({  form }: {  form: any }) {
  const [headIds, setHeadIds] = React.useState<string[]>(
    form.getValues().headIds || []
  );
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const addHeadId = (id: string) => {
    //only add if donot exist
    if (!headIds.includes(id)) {
      setHeadIds([...headIds, id]);
      form.setValue("headIds", [...form.getValues().headIds!, id]);
    } else {
      //remove
      setHeadIds(headIds.filter((headId) => headId !== id));
      form.setValue(
        "headIds",
        form.getValues().headIds?.filter((headId: string) => headId !== id)
      );
    }
  };
  const { data: heads } = useQuery({
    queryKey: [QUERY_KEYS.ALL_PERSONS],
    queryFn: async () => {
      const { data } = await axios.get(`/api/${REAVALIDAION_TIME.PERSON.type}`);
      return data;
    },
  });

  const filteredHeads: PERSON[] = heads?.filter((head: PERSON) =>
    head.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  return (
    <div>
      <div className=" max-w-80 min-w-64 items-center gap-1.5">
        <Label htmlFor="email">Search Heads</Label>
        <Input
          type="text"
          id="email"
          placeholder="Person name"
          value={searchQuery}
          onChange={handleInputChange}
          autoComplete="off"
        />
      </div>
      <ScrollArea className="h-auto max-w-80 min-w-64 rounded-md border mt-1">
        <div className="py-2 px-1">
          {/* <h4 className="mb-4 text-sm font-medium leading-none">Persons</h4> */}
          {filteredHeads?.map((person, i) => (
            <div
              key={person.id}
              onClick={() => addHeadId(person.id)}
              className="hover:bg-gray-100 cursor-pointer  px-2 py-1 rounded-md transition-colors"
            >
              <span className="text-sm truncate flex overflow-hidden">
                {headIds?.includes(person.id) ? (
                  <Check className="w-4 h-4 mr-2" />
                ) : null}{" "}
                {person.fullName}
              </span>

              {i !== filteredHeads?.length - 1 ? (
                <Separator className="my-1" />
              ) : null}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
