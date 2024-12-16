import { PencilSquareIcon } from "@heroicons/react/24/solid";
import React from "react";

export default function ChangeImage() {
  // Ref para el input de archivo
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Función que abre el input al hacer clic en el icono
  const openFileInput = () => {
    fileInputRef.current?.click();  // Esto abrirá el cuadro de selección de archivos
  };

  return (
    <div className="absolute top-2 right-2">
      {/* Icono de cierre que actúa como botón */}
      <PencilSquareIcon
        className="text-white w-8 cursor-pointer transition-all hover:text-gray-400"
        onClick={openFileInput} // Al hacer clic, abre el selector de archivos
      />

      {/* Input de archivo oculto */}
      <input
        ref={fileInputRef} // Usamos una referencia para acceder al input
        type="file"
        accept="image/*"
        className="hidden" // Lo ocultamos visualmente
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            console.log("Imagen seleccionada:", file);
          }
        }}
      />
    </div>
  );
}
