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
import { QUERY_KEYS, REAVALIDAION_TIME } from "@/actions/contants";
import axiosInstance from "@/lib/axios";
type props = {
  type: string;
  queryKey: string;
  path: string;
};

export function DeleteDialog({ type, queryKey, path }: props) {
  const session = useSession();
  const queryClient = new QueryClient();

  const params = useParams();
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(API + `${type}/${params.id}`, {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + session!.data!.user.token || "",
          },
        });
        if (!res.ok) {
          throw new Error(`Failed to delete ${type}`);
        }
        return res.json();
      } catch (error: any) {
        throw new Error(error.response.data.message);
      }
    },
    onSuccess: async () => {
      toast.success(`${type} deleted successfully`);
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      const { data } = await axiosInstance.post("/api/revalidate", {
        tags:
          queryKey === QUERY_KEYS.ALL_PERSONS
            ? REAVALIDAION_TIME.PERSON.TAGS(String(params.id))
            : REAVALIDAION_TIME.SCHOOL.TAGS(String(params.id)),
        path: "/dashboard",
      });
      if (data) {
        router.push(path);
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
          <DialogTitle>Delete</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this Data? This action cannot be
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
