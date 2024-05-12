import { ChangeEvent, useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import Image from "next/image";
// const LIMIT = 5;

type UploadImagesProps = {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<any[]>>;
};

export function UploadImages({ files, setFiles }: UploadImagesProps) {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [key, setKey] = useState(99 * Math.random());

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const fileList: FileList | null = event.target.files;
    if (fileList) {
      const imageFiles = Array.from(fileList);
      for (const image of imageFiles) {
        // if (files.length >= LIMIT) {
        //   alert(`You can only upload ${LIMIT} images.`);
        //   break;
        // }
        const imageUrl = URL.createObjectURL(image);
        setPreviewUrls((prev) => [...prev, imageUrl]);
        setFiles((prev) => [...prev, image]);
      }
    }
  };
  const handleRemoveImage = (index: number) => {
    const updatedFiles = [...files];
    const updatedUrls = [...previewUrls];
    updatedFiles.splice(index, 1);
    updatedUrls.splice(index, 1);
    setFiles(updatedFiles);
    setPreviewUrls(updatedUrls);
  };

  useEffect(() => {
    if (files.length === 0) {
      setKey(99 * Math.random());
      setPreviewUrls([]);
    }
  }, [files.length]);

  return (
    <div className="flex flex-col gap-2">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="picture">Picture</Label>
        <Input
          id="picture"
          type="file"
          accept="image/*"
          multiple
          key={key}
          onChange={handleImageUpload}
        />
      </div>
      {files.length === 0 ? (
        <p className="text-sm text-gray-500">
          No images selected. Select images to upload.
        </p>
      ) : (
        <p className="text-sm text-gray-500">{files.length} images selected</p>
      )}
      <div className="flex flex-wrap gap-2">
        {previewUrls.map((imageUrl, index) => (
          <div key={index} className={`relative `}>
            <Image
              src={imageUrl}
              height={328}
              width={328}
              alt={`Uploaded Image ${index}`}
              className="w-32 h-32 object-cover"
            />

            <button
              onClick={() => handleRemoveImage(index)}
              type="button"
              className="absolute top-0 right-0 p-1 bg-white rounded-full"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
