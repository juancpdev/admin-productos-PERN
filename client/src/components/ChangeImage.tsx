import { PencilSquareIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
import { useFetcher } from "react-router-dom";
import { PulseLoader } from "react-spinners";

type ChangeImageProps = {
  product: {
    id: number;
    image: string;
  };
};

export default function ChangeImage({ product }: ChangeImageProps) {
  const [loader, setLoader] = useState(false)
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

      setLoader(true)

      fetcher.submit(formData, {
        method: "post",
        action: "update-image",
        encType: "multipart/form-data",
      });

    }
  };

  // Usar useEffect para detener el loader cuando se reciba la respuesta
  useEffect(() => {
    if (fetcher.data?.success) {
      setLoader(false);
    }
  }, [fetcher.data]); // Se ejecuta cuando fetcher.data cambia
  return (



    <div className="absolute top-2 right-2">
      {loader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <PulseLoader color="#ffffff" size={15} />
        </div>
      )}
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
