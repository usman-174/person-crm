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

import { SCHOOL } from "@/types/COMMON";
import axios from "axios";
import { useState } from "react";
import CountriesSelect from "../CountriesSelect";
import { SelectHeads } from "../SelectHeads";
import ShowImages from "../ShowImages";
import { UploadImages } from "../UploadImages";
import { editSchoolSchema } from "./validations/editSchool";
type props = {
  school: SCHOOL;
};
export function EditSchool({ school }: props) {
  // const session = useSession();

  const queryClient = new QueryClient();

  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [toastId, setToastId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof editSchoolSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(editSchoolSchema),
    defaultValues: {
      id: school.id,
      name: school.name || "",
      country: school.country || ``,
      state: school.state || "",
      city: school.city || "",
      notes: school.notes || "",


      headIds: school.heads?.map((head) => head.id) || [],
      organizationId: school.organizationId || "",
    },
  });

  const { data: organizations } = useQuery({
    queryKey: [QUERY_KEYS.ALL_ORGANIZATIONS],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/${REAVALIDAION_TIME.ORGANIZATION.type}`
      );
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (payload: z.infer<typeof editSchoolSchema>) => {
      try {
        const { data } = await axios.put(
          `${process.env.NEXT_PUBLIC_BASE_URL}/${REAVALIDAION_TIME.SCHOOL.type}/${school.id}`,
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
    onSuccess: async () => {
      const urls = [];
      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const formData = new FormData();
          formData.append("file", files[i]);
          formData.append("upload_preset", "person-crm");
          formData.append("folder", "schools");

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
          typeId: school.id,
          images: urls,
        });
      }
      await axios.post("/api/revalidate", {
        tags: [
          ...REAVALIDAION_TIME.COUNT.TAGS,
          ...REAVALIDAION_TIME.SCHOOL.TAGS(school.id),
        ],
        path :"/"
      });

      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ALL_SCHOOLS] });
      setFiles([]);
      toast.dismiss(toastId!);
      setToastId(null);
      toast.success(`${REAVALIDAION_TIME.INCIDENT.type} Edited successfully`);

      router.refresh();
    },
    onError: (error: any) => {
      toast.dismiss(toastId!);

      toast.error(error.message);
    },
  });
  function onSubmit(values: z.infer<typeof editSchoolSchema>) {
    const id = toast.loading("Updating School...");
    setToastId(id);
    mutation.mutate(values);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center gap-5 flex-wrap sm:flex-nowrap md:justify-between ">
          <FormField
            control={form.control}
            name="name"
            render={({ field, formState }) => (
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
        <SelectHeads form={form} />
        <ShowImages images={school?.images || []} />
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
