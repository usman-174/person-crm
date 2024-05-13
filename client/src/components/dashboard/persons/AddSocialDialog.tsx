import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { REAVALIDAION_TIME, SOCIAL_PLATFORMS } from "@/actions/contants";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { addSocialSchema } from "./socials/validation/addSocailSchema";

interface AddSocialDialogProps {
  personId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function AddSocialDialog({
  personId,
  open,
  setOpen,
}: AddSocialDialogProps) {
  // const queryClient = new QueryClient();
  const router = useRouter();
  const form = useForm<z.infer<typeof addSocialSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(addSocialSchema),
    defaultValues: {
      account: "",
      //   platform: ",
    },
  });
  const mutation = useMutation({
    mutationFn: async (payload: z.infer<typeof addSocialSchema>) => {
      try {
        const { data } = await axios.post(
          `/api/${REAVALIDAION_TIME.PERSON.type}/social`,
          payload
        );
      } catch (error: any) {
        console.log(
          error.response?.data?.message || "Failed to add Social Platform"
        );

        throw new Error(
          error.response?.data?.message || "Failed to add Social Platform"
        );
      }
    },
    onSuccess: async () => {
      toast.success("Added  Social Platform");
      // queryClient.invalidateQueries({ queryKey: ["social-platforms"] });
      let { data } = await axios.post("/api/revalidate", {
        tags: [...REAVALIDAION_TIME.PERSON.TAGS(personId)],
      });
      if (data) {
        router.refresh();
        setOpen(false);
      }
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
  function onSubmit(values: z.infer<typeof addSocialSchema>) {
    mutation.mutate({
      ...values,
      personId: personId,
    });
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="outline" onClick={() => setOpen(true)}>
          <PlusIcon /> Add Social Platform
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[40vw]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex items-center gap-5 flex-wrap sm:flex-nowrap md:justify-between ">
              <FormField
                control={form.control}
                name="account"
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
                name="platform"
                render={({ field }) => (
                  <FormItem className="w-2/6">
                    <FormLabel>Platform</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
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
            </div>

            <Button
              type="submit"
              disabled={mutation.isPending}
              aria-disabled={mutation.isPending}
            >
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
