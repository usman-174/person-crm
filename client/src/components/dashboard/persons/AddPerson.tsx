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
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { QueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import CountriesSelect from "../CountriesSelect";
import { UploadImages } from "../UploadImages";
import { addPersonSchema } from "./valdidations/addPerson";
export function AddPerson() {
  const queryClient = new QueryClient();
  const [files, setFiles] = useState<File[]>([]);

  const router = useRouter();
  const form = useForm<z.infer<typeof addPersonSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(addPersonSchema),
    defaultValues: {
      username: "",
      fname: "",
      lname: "",
      state: "",
      country: "",
      title: "",
      city: "",
      notes: "",
      DOB: new Date(),
    },
  });

  const mutation = useMutation({
    mutationFn: async (payload: z.infer<typeof addPersonSchema>) => {
      try {
        const { data } = await axios.post(`/api/person`, payload);
        return data;
      } catch (error: any) {
        throw new Error(
          error.response?.data?.message || "Failed to add Person"
        );
      }
    },
    onSuccess: async (response) => {
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
          typeId: response.id,
          images: urls,
        });
      }
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ALL_PERSONS] });
      let { data } = await axios.post("/api/revalidate", {
        tags: [...REAVALIDAION_TIME.COUNT.TAGS, QUERY_KEYS.ALL_PERSONS],
      });
      toast.success("Person Added successfully");
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
        <CountriesSelect form={form} />
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
        <UploadImages files={files} setFiles={setFiles} />
        <Button
          type="submit"
          disabled={mutation.isPending}
          aria-disabled={mutation.isPending}
        >
          Add
        </Button>
      </form>
    </Form>
  );
}
