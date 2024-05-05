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
import { API } from "@/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import { QUERY_KEYS, REAVALIDAION_TIME } from "@/actions/contants";

import axiosInstance from "@/lib/axios";

import { SelectHeads } from "../SelectHeads";
import { addOrganizationSchema } from "./validations/addOrganizationSchema";

export function AddOrganization() {
  const session = useSession();
  const queryClient = new QueryClient();

  const router = useRouter();

  const form = useForm<z.infer<typeof addOrganizationSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(addOrganizationSchema),
    defaultValues: {
      name: "",

      city: "",
      notes: "",
      headIds: [],
    },
  });

  const mutation = useMutation({
    mutationFn: async (payload: z.infer<typeof addOrganizationSchema>) => {
      try {
        const { data } = await axiosInstance.post(
          `${API}${REAVALIDAION_TIME.ORGANIZATION.type}`,
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
            `Failed to add ${REAVALIDAION_TIME.ORGANIZATION.type}`
        );
      }
    },
    onSuccess: async () => {
      toast.success(`${REAVALIDAION_TIME.ORGANIZATION.type} Added successfully`);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ALL_ORGANIZATIONS] });
      let { data } = await axiosInstance.post("/api/revalidate", {
        tags: REAVALIDAION_TIME.COUNT.TAGS,
      });
      if (data) {
        router.push(`/dashboard/${QUERY_KEYS.ALL_ORGANIZATIONS}`);
      }
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
  function onSubmit(values: z.infer<typeof addOrganizationSchema>) {
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

        <SelectHeads token={session.data?.user.token} form={form} />

        <Button type="submit" disabled={mutation.isPending}
        aria-disabled={mutation.isPending}>Submit</Button>
      </form>
    </Form>
  );
}
