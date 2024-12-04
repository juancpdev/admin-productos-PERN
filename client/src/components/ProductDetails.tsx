import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Product } from "../types";
import { formatCurrency } from "../utils";
import { Form, Link, useFetcher } from "react-router-dom";
import Swal from "sweetalert2";
import Toggle from 'react-toggle';
import { useState } from "react";

type ProductDetailsProp = {
    product: Product
};

export default function ProductDetails({ product }: ProductDetailsProp) {
    const fetcher = useFetcher();
    const [isEditing, setIsEditing] = useState(false); // Estado para activar modo edición
    const [price, setPrice] = useState(product.price); // Estado para almacenar el precio actualizado

    const handleDoubleClick = () => {
        setIsEditing(true);
    };

    const handleBlur = () => {
        setIsEditing(false);

        // Enviar el precio actualizado al backend si cambió
        if (price !== product.price) {
            fetcher.submit(
                { id: product.id.toString(), price: price.toString() },
                { method: "POST", action: `/productos/actualizar-precio/${product.id}` }
            );
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleBlur();
        } else if (event.key === "Escape") {
            setPrice(product.price); // Restaurar el precio original si se presiona Escape
            setIsEditing(false);
        }
    };

    return (
        <tr className="border-t text-center">
            <td className="p-3 text-lg text-gray-800">
                {product.id}
            </td>
            <td className="p-3 text-lg text-gray-800">
                {product.name}
            </td>
            <td className="p-3 text-lg text-gray-800">
                {isEditing ? (
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(+e.target.value)}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        className="border rounded px-2 py-1 text-center w-full"
                    />
                ) : (
                    <span onDoubleClick={handleDoubleClick} className="cursor-pointer">
                        {formatCurrency(price)}
                    </span>
                )}
            </td>
            <td className="p-3 text-lg text-gray-800 ">
                <fetcher.Form method="POST" className="flex justify-center" action="/toggle-availability">
                    <Toggle
                        defaultChecked={product.availability}
                        onChange={(e) => {
                            e.currentTarget.form?.requestSubmit();
                        }}
                    />
                    <input type="hidden" name="id" value={product.id} />
                </fetcher.Form>
            </td>
            <td className="p-3 text-lg text-gray-800">
                <div className="flex gap-5 justify-center">
                    <Link to={`/productos/editar/${product.id}`}>
                        <PencilSquareIcon className="w-6 cursor-pointer hover:text-gray-500 transition-all" />
                    </Link>
                    <Form
                        method="POST"
                        className="flex justify-center"
                        action={`productos/eliminar/${product.id}`}
                        onSubmit={async (e) => {
                            e.preventDefault();
                            const result = await Swal.fire({
                                title: "¿Quieres eliminar el producto?",
                                text: "No podrás revertir esto.",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#3085d6",
                                cancelButtonColor: "#d33",
                                confirmButtonText: "Sí, eliminar",
                                cancelButtonText: "Cancelar",
                            });

                            if (result.isConfirmed) {
                                fetcher.submit(e.target as HTMLFormElement);
                            }
                        }}
                    >
                        <button type="submit">
                            <TrashIcon className="w-6 cursor-pointer text-red-600 hover:text-red-400" />
                        </button>
                    </Form>
                </div>
            </td>
        </tr>
    );
}
