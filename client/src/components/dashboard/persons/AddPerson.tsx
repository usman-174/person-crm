"use client";

import { QUERY_KEYS, REAVALIDAION_TIME } from "@/actions/contants";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { API } from "@/constants";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { QueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { addPersonSchema } from "./valdidations/addPerson";

export function AddPerson() {
  const session = useSession();
  const queryClient = new QueryClient();

  const router = useRouter();
  const form = useForm<z.infer<typeof addPersonSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(addPersonSchema),
    defaultValues: {
      username: "",
      fname: "",
      lname: "",
      country: "",
      title: "",
      city: "",
      notes: "",
      DOB: new Date(),
    },
  });
  console.log({state:form.formState.errors});
  
  const mutation = useMutation({
    mutationFn: async (payload: z.infer<typeof addPersonSchema>) => {
      try {
        console.log({
          headers: {
            Authorization: `Bearer ${session.data?.user.token}`,
          },
        });

        const { data } = await axios.post(`${API}person`, payload, {
          headers: {
            Authorization: `Bearer ${session.data?.user.token}`,
          },
        });
      } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to add Person");
      }
    },
    onSuccess: async () => {
      toast.success("User Added successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ALL_PERSONS] });
      let { data } = await axios.post("/api/revalidate", {
        tags: [...REAVALIDAION_TIME.COUNT.TAGS, QUERY_KEYS.ALL_PERSONS],
     
      });
      if (data) {
        router.push("/dashboard/persons");
      }
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
  function onSubmitx(values: z.infer<typeof addPersonSchema>) {
  
    mutation.mutate({
      ...values,
      fullName: `${values.fname} ${values.lname}`,
      DOB: new Date(format(values.DOB, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")),
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitx)} className="space-y-8">
        <div className="flex items-center gap-5 flex-wrap sm:flex-nowrap md:justify-between ">
          <FormField
            control={form.control}
            name="username"
            render={({ field, formState }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Email..."
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
            name="title"
            render={({ field, formState }) => (
              <FormItem className="w-full">
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Title" {...field} autoComplete="false" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex items-center gap-5 flex-wrap sm:flex-nowrap md:justify-between ">
          <FormField
            control={form.control}
            name="fname"
            render={({ field, formState }) => (
              <FormItem className="w-full">
                <FormLabel>FirstName</FormLabel>
                <FormControl>
                  <Input
                    placeholder="FirstName"
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
            name="lname"
            render={({ field, formState }) => (
              <FormItem className="w-full">
                <FormLabel>LastName</FormLabel>
                <FormControl>
                  <Input
                    placeholder="LastName"
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
            name="country"
            render={({ field, formState }) => (
              <FormItem className="w-full">
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Country"
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
            name="state"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="State" {...field} autoComplete="false" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>
                  City{" "}
                  <span className="text-xs text-muted-foreground">
                    (optional)
                  </span>{" "}
                </FormLabel>
                <FormControl>
                  <Input placeholder="City" {...field} autoComplete="false" />
                </FormControl>

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
        <div className="flex items-center gap-5 flex-wrap sm:flex-nowrap md:justify-start ">
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
          <FormField
            control={form.control}
            name="DOB"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of birth</FormLabel>
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
        </div>

        <Button type="submit" disabled={mutation.isPending}
        aria-disabled={mutation.isPending}>Add</Button>
      </form>
    </Form>
  );
}
