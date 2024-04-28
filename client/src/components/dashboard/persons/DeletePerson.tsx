"use client";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { API } from "@/constants";
import { useSession } from "next-auth/react";
import axios from "axios";
import { REAVALIDAION_TIME } from "@/actions/contants";

export function DeleteDialog() {
  const session = useSession();
  const queryClient = new QueryClient();
  console.log({ session });

  const params = useParams();
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(API + `person/${params.id}`, {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + session!.data!.user.token || "",
          },
        });
        if (!res.ok) {
          throw new Error("Failed to delete Person");
        }
        return res.json();
      } catch (error: any) {
        throw new Error(error.response.data.message);
      }
    },
    onSuccess: async () => {
      toast.success("Person deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["persons"] });
      const { data } = await axios.post("/api/revalidate", {
        tags: REAVALIDAION_TIME.COUNT.TAGS,
        path : "/dashboard"
      });
      if (data) {
        router.push("/dashboard/persons");
      }
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Trash2 className="mr-2 h-4 w-4 text-destructive" />
          <span>Delete</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Person</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this Person? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-start gap-2">
          <Button className="bg-destructive" onClick={() => mutation.mutate()}>
            Delete
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
