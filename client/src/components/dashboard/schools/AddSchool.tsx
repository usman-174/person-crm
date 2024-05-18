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
import { zodResolver } from "@hookform/resolvers/zod";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import { QUERY_KEYS, REAVALIDAION_TIME } from "@/actions/contants";

import axios from "axios";
import { useState } from "react";
import CountriesSelect from "../CountriesSelect";
import { SelectHeads } from "../SelectHeads";
import { UploadImages } from "../UploadImages";
import { addSchoolSchema } from "./validations/addSchool";

export function AddSchool() {
  const queryClient = new QueryClient();
  const [files, setFiles] = useState<File[]>([]);

  const router = useRouter();
  const form = useForm<z.infer<typeof addSchoolSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(addSchoolSchema),
    defaultValues: {
      name: "",
      state: "",
      country: "",
      city: "",
      notes: "",
      headIds: [],
      organizationId: "",
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

  const mutation = useMutation({
    mutationFn: async (payload: z.infer<typeof addSchoolSchema>) => {
      try {
        const { data } = await axios.post(
          `/api/${REAVALIDAION_TIME.SCHOOL.type}`,
          payload
        );
        return data;
      } catch (error: any) {
        throw new Error(
          error.response?.data?.message ||
            `Failed to add ${REAVALIDAION_TIME.SCHOOL.type}`
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
          formData.append("folder", "school");

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
          type: REAVALIDAION_TIME.SCHOOL.type,
          typeId: response.id,
          images: urls,
        });
      }
      toast.success(`${REAVALIDAION_TIME.SCHOOL.type} Added successfully`);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ALL_SCHOOLS] });
      let { data } = await axios.post("/api/revalidate", {
        tags: [
          ...REAVALIDAION_TIME.COUNT.TAGS,
          REAVALIDAION_TIME.CITIES.type,
          REAVALIDAION_TIME.STATES.type,
        ],
        path :"/"
      });
      setFiles([]);
      if (data) {
        router.push(`/dashboard/${QUERY_KEYS.ALL_SCHOOLS}`);
      }
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
  function onSubmit(values: z.infer<typeof addSchoolSchema>) {
    console.log("values", values);

    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center gap-5 flex-wrap sm:flex-nowrap md:justify-between ">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Name..."
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
            name="organizationId"
            render={({ field }) => (
              <FormItem className="md:min-w-52">
                <FormLabel>Organization</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an Organization" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {organizations?.map((item: any) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

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
                <Textarea placeholder="Notes" {...field} autoComplete="false" />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <SelectHeads form={form} />
        <UploadImages files={files} setFiles={setFiles} />
        <Button
          type="submit"
          disabled={mutation.isPending}
          aria-disabled={mutation.isPending}
        >
          Submit
        </Button>
      </form>
    </Form>
  );
}
