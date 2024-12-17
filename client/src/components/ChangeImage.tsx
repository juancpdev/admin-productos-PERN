import { PencilSquareIcon } from "@heroicons/react/24/solid";
import React from "react";
import { useFetcher } from "react-router-dom";

type ChangeImageProps = {
  product: {
    id: number;
    image: string;
  };
};

export default function ChangeImage({ product }: ChangeImageProps) {
  const fetcher = useFetcher();
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Abrir el input de archivo
  const openFileInput = () => {
    fileInputRef.current?.click();
  };

  // Manejar el cambio de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("id", product.id.toString());
      formData.append("image", file);

      fetcher.submit(formData, {
        method: "post",
        action: "update-image",
        encType: "multipart/form-data",
      });

    }
  };

  return (
    <div className="absolute top-2 right-2">
      <PencilSquareIcon
        className="text-white w-8 cursor-pointer transition-all hover:text-gray-400"
        onClick={openFileInput}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
