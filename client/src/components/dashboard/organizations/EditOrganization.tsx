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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import { QUERY_KEYS, REAVALIDAION_TIME } from "@/actions/contants";

import { ORGANIZATION } from "@/types/COMMON";
import axios from "axios";
import { useState } from "react";
import CountriesSelect from "../CountriesSelect";
import { SelectHeads } from "../SelectHeads";
import ShowImages from "../ShowImages";
import { UploadImages } from "../UploadImages";
import { editOrganizationSchema } from "./validations/editOrganizationSchema";
type props = {
  organization: ORGANIZATION;
};
export function EditOrganization({ organization }: props) {
  const queryClient = new QueryClient();

  const router = useRouter();
  const [toastId, setToastId] = useState<string | null>(null);
  const [files, setFiles] = useState<FileList | any>([]);

  const form = useForm<z.infer<typeof editOrganizationSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(editOrganizationSchema),
    defaultValues: {
      id: organization.id,
      name: organization.name,
      country: organization.country || ``,
      state: organization.state || "",
      city: organization.city || "",
      notes: organization.notes || "",
      headIds: organization.heads?.map((head) => head.id) || [],
    },
  });

  const mutation = useMutation({
    mutationFn: async (payload: z.infer<typeof editOrganizationSchema>) => {
      try {
        const { data } = await axios.put(
          `/api/${REAVALIDAION_TIME.ORGANIZATION.type}/${organization.id}`,
          payload
        );
        return data;
      } catch (error: any) {
        throw new Error(
          error.response?.data?.message ||
            `Failed to add ${REAVALIDAION_TIME.ORGANIZATION.type}`
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
          formData.append("folder", "organization");

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
          type: REAVALIDAION_TIME.ORGANIZATION.type,
          typeId: organization.id,
          images: urls,
        });
      }
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ALL_ORGANIZATIONS],
      });
      let { data } = await axios.post("/api/revalidate", {
        tags: [
          ...REAVALIDAION_TIME.COUNT.TAGS,
          ...REAVALIDAION_TIME.ORGANIZATION.TAGS(organization.id),
        ],
        path :"/"
      });
      setFiles([]);
      toast.dismiss(toastId!);
      toast.success("Organization Updated successfully");
      router.refresh();
    },
    onError: (error: any) => {
      toast.dismiss(toastId!);

      toast.error(error.message);
    },
  });
  function onSubmit(values: z.infer<typeof editOrganizationSchema>) {
    const id = toast.loading("Updating Organization...");
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
        <ShowImages images={organization?.images || []} />
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
