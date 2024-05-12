"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { IMAGE } from "@/types/COMMON";
import axios from "axios";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";

type props = {
  images: IMAGE[];
};
export default function ShowImages({ images }: props) {
  const pathname = usePathname();
  const isEdit = pathname.includes("edit");
  const router = useRouter();
  const handleDelete = async (image: IMAGE) => {
    if (!confirm("Are you sure you want to delete this image?")) {
      return;
    }
    const toastId = toast.loading("Deleting image...");
    try {
      await axios.post("/api/images/delete", {
        image,
      });
      await axios.post("/api/revalidate", {
        path: pathname,
      });
      router.refresh();
    } catch (error: any) {
      console.log("error=>", error.message);
    } finally {
      toast.dismiss(toastId);
      toast.success("Image deleted successfully");
    }
  };
  const handleMakePrimary = async (image: IMAGE) => {
    if (!confirm("Are you sure you want to make this image primary?")) {
      return;
    }
    const toastId = toast.loading("Chaning Primary Image...");
    try {
      await axios.put("/api/images", {
        image,
      });
      await axios.post("/api/revalidate", {
        path: pathname,
      });
      router.refresh();
    } catch (error: any) {
      console.log("error=>", error.message);
    } finally {
      toast.dismiss(toastId);
      toast.success("Image Changed successfully");
    }
  };
  return (
    <div className="my-10">
      <h1 className="mb-3 font-semibold text-xl">Images:</h1>
      {images.length ? (
        <div className="flex items-center flex-wrap gap-1">
          {images?.map((image, index) => (
            <div
              key={image.id + index}
              className="relative aspect-square w-44 md:w-64 shadow-sm"
            >
              <ImageDialog image={image} />
              {isEdit ? (
                <div className="absolute top-2 right-2 flex items-center gap-1">
                  <Trash2
                    onClick={() => handleDelete(image)}
                    className=" text-red-500 bg-black text-xs cursor-pointer rounded-md"
                  />
                  {!image.primary ? (
                    <Button
                      type="button"
                      onClick={() => handleMakePrimary(image)}
                      variant={"outline"}
                      size={"xs"}
                      className="  cursor-pointer rounded-md"
                    >
                      Set Primary
                    </Button>
                  ) : null}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <p>No images found</p>
      )}
    </div>
  );
}

export function ImageDialog({ image }: { image: IMAGE }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Image
          src={image.url}
          loading="lazy"
          alt={"img" + image.id}
          fill
          className={`object-cover w-full h-full ${
            image.primary ? "border-green-500  border-4" : ""
          }`}
        />
      </DialogTrigger>
      <DialogContent className="min-w-fit">
        <div className={`w-[90vw] h-[80vh] `}>
          <Image
            src={image.url}
            alt={"img" + image.id}
            fill
            className="object-contain w-full h-full aspect-square"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
