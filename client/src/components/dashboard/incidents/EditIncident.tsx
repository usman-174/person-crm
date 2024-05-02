"use client";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { API } from "@/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import { QUERY_KEYS, REAVALIDAION_TIME } from "@/actions/contants";

import axiosInstance from "@/lib/axios";


import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { INCIDENT } from "@/types/COMMON";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { IncidentSelects } from "./IncidentSelects";
import { addIncidentSchema } from "./validations/addIncident";
type props = {
  incident: INCIDENT;
};
export function EditIncident({ incident }: props) {
  const session = useSession();
  const queryClient = new QueryClient();

  const router = useRouter();

  const form = useForm<z.infer<typeof addIncidentSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(addIncidentSchema),
    defaultValues: {
      targeted: incident.targeted || "",
      date: new Date(incident.date|| Date.now()),
      time: incident.time || "",
      title: incident.title || "",
      source: incident.source || "SOCIAL_MEDIA",
        location: incident.location || "",
        type: incident.type || "",
      notes: incident.notes || "",
      personIds: incident.persons.map((person) => person.id) || [],
      organizationIds: incident.organizations.map((org) => org.id) || [],
      schoolIds: incident.schools.map((school) => school.id) || [],
    },
  });

  const { data: organizations } = useQuery({
    queryKey: [QUERY_KEYS.ALL_INCIDENTS],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `${API}${REAVALIDAION_TIME.INCIDENT.type}`,
        {
          headers: {
            Authorization: `Bearer ${session.data?.user.token}`,
          },
        }
      );
      return data;
    },
    enabled: !!session.data?.user?.token,
  });

  const mutation = useMutation({
    mutationFn: async (payload: z.infer<typeof addIncidentSchema>) => {
      try {
        const { data } = await axiosInstance.put(
          `${API}${REAVALIDAION_TIME.INCIDENT.type}/${incident.id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${session.data?.user.token}`,
            },
          }
        );
      } catch (error: any) {
        throw new Error(
          error.response?.data?.message ||
            `Failed to add ${REAVALIDAION_TIME.INCIDENT.type}`
        );
      }
    },
    onSuccess: async () => {
      toast.success(`${REAVALIDAION_TIME.INCIDENT.type} Edited successfully`);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ALL_INCIDENTS] });
      let { data } = await axiosInstance.post("/api/revalidate", {
        tags: [
            ...REAVALIDAION_TIME.COUNT.TAGS,
            ...REAVALIDAION_TIME.INCIDENT.TAGS(incident.id),
          ],
      });
    //   if (data) {
    //     router.push(`/dashboard/${QUERY_KEYS.ALL_INCIDENTS}`);
    //   }
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
  function onSubmit(values: z.infer<typeof addIncidentSchema>) {
    console.log("values", values);

    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center gap-5 flex-wrap sm:flex-nowrap md:justify-between ">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Title..."
                    {...field}
                    autoComplete="false"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Location..."
                    {...field}
                    autoComplete="false"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center gap-5 flex-wrap sm:flex-nowrap md:justify-between ">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <Input placeholder="Type" {...field} autoComplete="false" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="targeted"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Targeted </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Targeted"
                    {...field}
                    autoComplete="false"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="source"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Soruce" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="SOCIAL_MEDIA">Social Media</SelectItem>
                    <SelectItem value="PERSON">PERSON</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="notes"
          render={({ field, formState }) => (
            <FormItem className="w-full">
              <FormLabel>
                Notes
                <span className="text-xs text-muted-foreground">
                  {" "}
                  (optional)
                </span>{" "}
              </FormLabel>
              <FormControl>
                <Textarea placeholder="Notes" {...field} autoComplete="false" />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center gap-5 flex-wrap sm:flex-nowrap md:justify-between ">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of Incident</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>
                  Time{" "}
                  <span className="text-xs text-muted-foreground">
                    (optional)
                  </span>{" "}
                </FormLabel>
                <FormControl>
                  <Input placeholder="Time" {...field} autoComplete="false" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <IncidentSelects token={session.data?.user.token} form={form} />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
