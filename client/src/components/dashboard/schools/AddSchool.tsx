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
import axios from "axios";

import axiosInstance from "@/lib/axios";
import { addSchoolSchema } from "./validations/addSchool";

export function AddSchool() {
  const session = useSession();
  const queryClient = new QueryClient();

  const router = useRouter();
  const form = useForm<z.infer<typeof addSchoolSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(addSchoolSchema),
    defaultValues: {
      name: "",
      state: "",
      city: "",
      notes: "",
      headId: "",
      organizationId: "",
    },
  });
  const { data: heads } = useQuery({
    queryKey: [QUERY_KEYS.ALL_HEADS],
    queryFn: async () => {
      const { data } = await axios.get(`${API}${REAVALIDAION_TIME.HEAD.type}`, {
        headers: {
          Authorization: `Bearer ${session.data?.user.token}`,
        },
      });
      return data;
    },
  });
  const { data: organizations } = useQuery({
    queryKey: [QUERY_KEYS.ALL_ORGANIZATIONS],
    queryFn: async () => {
      const { data } = await axios.get(
        `${API}${REAVALIDAION_TIME.ORGANIZATION.type}`,
        {
          headers: {
            Authorization: `Bearer ${session.data?.user.token}`,
          },
        }
      );
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (payload: z.infer<typeof addSchoolSchema>) => {
      try {
        const { data } = await axiosInstance.post(
          `${API}${REAVALIDAION_TIME.SCHOOL.type}`,
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
            `Failed to add ${REAVALIDAION_TIME.SCHOOL.type}`
        );
      }
    },
    onSuccess: async () => {
      toast.success(`${REAVALIDAION_TIME.SCHOOL.type} Added successfully`);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ALL_SCHOOLS] });
      let { data } = await axiosInstance.post("/api/revalidate", {
        tags: REAVALIDAION_TIME.COUNT.TAGS,
      });
      if (data) {
        router.push(`/dashboard/${QUERY_KEYS.ALL_SCHOOLS}`);
      }
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
  function onSubmit(values: z.infer<typeof addSchoolSchema>) {
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
        </div>

        <div className="flex items-center gap-5 flex-wrap sm:flex-nowrap md:justify-between ">
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
            name="headId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Head</FormLabel>
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
                    {heads?.map((item: any) => (
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
          <FormField
            control={form.control}
            name="organizationId"
            render={({ field }) => (
              <FormItem>
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

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
