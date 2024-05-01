"use client";

import {
  QUERY_KEYS,
  REAVALIDAION_TIME,
  SOCIAL_PLATFORMS,
} from "@/actions/contants";
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
import { USER } from "@/types/USER";
import { zodResolver } from "@hookform/resolvers/zod";
import { QueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { CalendarIcon, Delete } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import { AddSocialDialog } from "./AddSocialDialog";
import { useEffect, useState } from "react";
import { editPersonSchema } from "./valdidations/EditPerson";
type props = {
  person: USER;
};
export function EditPerson({ person }: props) {
  const session = useSession();
  const [mounted, setMounted] = useState(false);
  const queryClient = new QueryClient();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof editPersonSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(editPersonSchema),
    defaultValues: {
      username: person.username || "",
      fname: person.fname || "",
      lname: person.lname || "",
      country: person.country || "",
      title: person.title || "",
      city: person.city || "",
      notes: person.notes || "",
      state: person.state || "",
      source: person.source || undefined,
      social: person.social,
      DOB: new Date(person.DOB!),
    },
  });

  const deleteSocialMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        const { data } = await axios.delete(`${API}person/social/${id}`, {
          headers: {
            Authorization: `Bearer ${session.data?.user.token}`,
          },
        });
      } catch (error: any) {
        throw new Error(
          error.response?.data?.message || "Failed to delete social"
        );
      }
    },
    onSuccess: async () => {
      let { data } = await axios.post("/api/revalidate", {
        tags: [...REAVALIDAION_TIME.PERSON.TAGS(person.id)],
      });
      toast.success("Social deleted successfully");
      router.refresh();
    },
  });

  const mutation = useMutation({
    mutationFn: async (payload: z.infer<typeof editPersonSchema>) => {
      try {
        const { data } = await axios.put(`${API}person/${person.id}`, payload, {
          headers: {
            Authorization: `Bearer ${session.data?.user.token}`,
          },
        });
      } catch (error: any) {
        throw new Error(
          error.response?.data?.message || "Failed to updated user"
        );
      }
    },
    onSuccess: async () => {
      let { data } = await axios.post("/api/revalidate", {
        tags: [
          ...REAVALIDAION_TIME.COUNT.TAGS,
          ...REAVALIDAION_TIME.PERSON.TAGS(person.id),
        ],
      });
      if (data) {
        router.refresh();
        // router.push("/dashboard/persons");
      }
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ALL_PERSONS] });
      toast.success("User Updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
  function onSubmit(values: z.infer<typeof editPersonSchema>) {
    mutation.mutate({
      ...values,
      fullName: `${values.fname} ${values.lname}`,
      DOB: new Date(format(values.DOB, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")),
    });
  }
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (person.social?.length) {
      form.setValue("social", person.social);
    }
  }, [person.social]);
  return (
    <>
      {mounted ? (
        <div>
          <div className="text-right ml-auto">
            <AddSocialDialog
              token={session.data?.user.token}
              open={open}
              setOpen={setOpen}
              personId={person.id}
            />
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                        <Input
                          placeholder="Title"
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
                        <Input
                          placeholder="State"
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
                        <Input
                          placeholder="City"
                          {...field}
                          autoComplete="false"
                        />
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
                      <Textarea
                        placeholder="Notes"
                        {...field}
                        autoComplete="false"
                      />
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
                          <SelectItem value="SOCIAL_MEDIA">
                            Social Media
                          </SelectItem>
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

              <div>
                {person?.social?.length &&
                  person.social!.map((social, ind) => (
                    <div
                      key={social.id}
                      className="flex items-center gap-5 flex-wrap sm:flex-nowrap md:justify-between "
                    >
                      <FormField
                        control={form.control}
                        name={`social.${ind}.account`}
                        render={({ field, formState }) => (
                          <FormItem className="w-full">
                            <FormLabel>Account</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Account..."
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
                        name={`social.${ind}.platform`}
                        render={({ field }) => (
                          <FormItem className="w-2/6">
                            <FormLabel>Platform</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value as string}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a Platform" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {SOCIAL_PLATFORMS.map((platform) => (
                                  <SelectItem
                                    key={platform.value}
                                    value={platform.value}
                                  >
                                    {platform.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Delete
                        size="30"
                        className="text-lg text-destructive mt-7 cursor-pointer"
                        onClick={() => {
                          confirm(
                            "Are you sure you want to delete this social?"
                          ) && deleteSocialMutation.mutate(social.id);
                        }}
                      />
                    </div>
                  ))}
              </div>
              <Button type="submit">Save</Button>
            </form>
          </Form>
        </div>
      ) : null}
    </>
  );
}
