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
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon, Delete } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import { PERSON } from "@/types/COMMON";
import axios from "axios";
import { useEffect, useState } from "react";
import CountriesSelect from "../CountriesSelect";
import ShowImages from "../ShowImages";
import { UploadImages } from "../UploadImages";
import { AddSocialDialog } from "./AddSocialDialog";
import { editPersonSchema } from "./valdidations/EditPerson";

type props = {
  person: PERSON;
};
export function EditPerson({ person }: props) {
  const [toastId, setToastId] = useState<string | null>(null);

  const [mounted, setMounted] = useState(false);
  const [files, setFiles] = useState<FileList | any>([]);
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
      DOB: new Date(person.DOB! || Date.now()),
    },
  });

  const deleteSocialMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        await axios.delete(`/api/person/social/${id}`);
      } catch (error: any) {
        throw new Error(
          error.response?.data?.message || "Failed to delete social"
        );
      }
    },
    onSuccess: async () => {
      await axios.post("/api/revalidate", {
        tags: [...REAVALIDAION_TIME.PERSON.TAGS(person.id)],
      });
      toast.success("Social deleted successfully");
      router.refresh();
    },
  });

  const mutation = useMutation({
    mutationFn: async (payload: z.infer<typeof editPersonSchema>) => {
      try {
        const { data } = await axios.put(
          `/api/${REAVALIDAION_TIME.PERSON.type}/${person.id}`,
          payload
        );
        return data;
      } catch (error: any) {
        throw new Error(
          error.response?.data?.message || "Failed to updated user"
        );
      }
    },
    onSuccess: async () => {
      const urls = [];
      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const formData = new FormData();
          formData.append("file", files[i]);
          formData.append("upload_preset", "person-crm");
          formData.append("folder", "person");

          // You can add additional parameters like folder name, tags, etc. if needed

          try {
            const { data } = await axios.post(
              `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
              formData
            );
            urls.push({ url: data.secure_url, public_id: data.public_id });
          } catch (error) {
            console.error("Error uploading image:", error);
            // Handle error
          }
        }
      }
      if (urls.length > 0) {
        await axios.post(`/api/images`, {
          type: REAVALIDAION_TIME.PERSON.type,
          typeId: person.id,
          images: urls,
        });
      }
      await axios.post("/api/revalidate", {
        tags: [
          ...REAVALIDAION_TIME.COUNT.TAGS,
          ...REAVALIDAION_TIME.PERSON.TAGS(person.id),
        ],
      });

      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ALL_PERSONS] });
      setFiles([]);
      toast.dismiss(toastId!);
      toast.success("Person Updated successfully");
      router.refresh();
    },
    onError: (error: any) => {
      toast.dismiss(toastId!);

      toast.error(error.message);
    },
  });
  function onSubmit(values: z.infer<typeof editPersonSchema>) {
    const id = toast.loading("Updating Person...");
    setToastId(id);
    // return;
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
                  render={({ field }) => (
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
                  render={({ field }) => (
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
                  render={({ field }) => (
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
              <CountriesSelect form={form} />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
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
                              {field?.value ? (
                                format(field?.value, "PPP")
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
                            captionLayout="dropdown"
                            fromYear={1988}
                            toYear={2035}
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
                {person?.social?.length
                  ? person.social!.map((social, ind) => (
                      <div
                        key={social.id+ind}
                        className="flex items-center gap-5 flex-wrap sm:flex-nowrap md:justify-between my-2"
                      >
                        <FormField
                          control={form.control}
                          name={`social.${ind}.account`}
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel>Account Link</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="http://example.com"
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
                    ))
                  : null}
              </div>

              <ShowImages images={person?.images || []} />
              <UploadImages files={files} setFiles={setFiles} />
              <Button
                type="submit"
                disabled={mutation.isPending}
                aria-disabled={mutation.isPending}
              >
                Save
              </Button>
            </form>
          </Form>
        </div>
      ) : null}
    </>
  );
}
