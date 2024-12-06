import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Product } from "../types";
import { formatCurrency } from "../utils";
import { Form, Link, useFetcher } from "react-router-dom";
import Swal from "sweetalert2";
import Toggle from 'react-toggle';
import { useState } from "react";
  import 'react-toastify/dist/ReactToastify.css';
import { ToastType } from "../views/Products";

type ProductDetailsProp = {
    product: Product,
    showToast: (message: string, type: ToastType) => void,
};

export default function ProductDetails({ product, showToast }: ProductDetailsProp ) {
    const fetcher = useFetcher();
    const [isEditing, setIsEditing] = useState(false);
    const [price, setPrice] = useState<string | number>(product.price);

    const MAX_PRICE = 9999999;

    const editingPrice = () => {
        setIsEditing(true)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setPrice(value)
    }

    const handleBlur = (e : React.FocusEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>) => {
        setIsEditing(false)
        
        if (+price > 0 && +price !== product.price &&+price <= MAX_PRICE) {
            showToast('Precio Actualizado', 'success')
            e.currentTarget.form?.requestSubmit()
        } else if(+price > MAX_PRICE) {
            showToast('El valor es muy grande', 'error')
            setPrice(product.price)
        } else {
            setPrice(product.price)
        }
    }

    const handleKeys = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setIsEditing(false)
            handleBlur(e)
            
        } else if (e.key === 'Escape') {
            setIsEditing(false)
        }
    }

    return (

        
        <tr className="border-t text-center">
            <td className="p-3 text-lg text-gray-800">
                {product.id}
            </td>
            <td className="p-3 text-lg text-gray-800">
                {product.name}
            </td>
            <td className="p-3 text-lg text-gray-800">
                {isEditing ?
                    <fetcher.Form method="POST" className="flex justify-center" action="/update-price">
                        <input 
                            type="number"
                            value={price}
                            onChange={handleInputChange}
                            onBlur={handleBlur} // es lo mismo que onBlur={(e) => updatePrice(e)}
                            onKeyDown={handleKeys}
                            autoFocus
                            className="border rounded text-center"
                        />
                        <input type="hidden" name="price" value={price} />
                        <input type="hidden" name="id" value={product.id} />
                    </fetcher.Form>
                    : 
                    <span
                        onDoubleClick={editingPrice}
                        className="cursor-pointer p-2 rounded-xl hover:bg-red-100 transition"
                    >
                        {formatCurrency(product.price)}
                    </span>
                }
            </td>
            <td className="p-3 text-lg text-gray-800 ">
                <fetcher.Form method="POST" className="flex justify-center" action="toggle-availability">
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