import { TrashIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Product } from "../types";
import { formatCurrency } from "../utils";
import { Form, useFetcher } from "react-router-dom";
import Swal from "sweetalert2";
import Toggle from 'react-toggle';
import { useState } from "react";
import 'react-toastify/dist/ReactToastify.css';
import { ToastType } from "../views/Products";
import ChangeImage from "./ChangeImage";

type ProductDetailsProp = {
    product: Product,
    showToast: (message: string, type: ToastType) => void,
};

type FieldProp = 'name' | 'price'

export default function ProductDetails({ product, showToast }: ProductDetailsProp ) {
    const fetcher = useFetcher();

    const [editField, setEditField] = useState<"name" | "price" | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [price, setPrice] = useState<string | number>(product.price);
    const [name, setName] = useState<string>(product.name);
    const [isImageOpen, setIsImageOpen] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false); // Estado para la clase adicional

    const MAX_PRICE = 9999999;
    const MAX_NAME = 20;

    const editingField = (field : FieldProp) => {
        setEditField(field);
        setIsEditing(true);
    };

    const handleInputChange = (field : FieldProp, e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        if(field === 'price') {
            setPrice(value)
        } else if(field === 'name') {
            setName(value)
        }
    }

    const handleBlur = (field : FieldProp, e : React.FocusEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>) => {
        setIsEditing(false)

        if(field === 'price') {
            if (+price > 0 && +price !== product.price && +price <= MAX_PRICE) {
                showToast('Precio Actualizado', 'success')
                e.currentTarget.form?.requestSubmit()
            } else if(+price > MAX_PRICE) {
                showToast('El valor es muy grande', 'error')
                setPrice(product.price)
            } else if(typeof price !== 'number' || +price <= 0) {
                showToast('Precio no valido', 'error')
                setPrice(product.price)
            } else {
                setPrice(product.price)
            }
        } else if(field === 'name') {
            if (name.length > 0 && name !== product.name && name.length <= MAX_NAME) {
                showToast('Nombre Actualizado', 'success')
                e.currentTarget.form?.requestSubmit()
            } else if(name.length > MAX_NAME) {
                showToast('El valor es muy grande', 'error')
                setName(product.name)
            } else {
                setName(product.name)
            }
        }
    }

    const handleKeys = (field: FieldProp, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setIsEditing(false)
            handleBlur(field, e)
        } else if (e.key === 'Escape') {
            setIsEditing(false)
        }
    }

    const customField = (field : FieldProp, value: string | number, type : string)  => (
        <fetcher.Form method="POST" className="flex justify-center" action={`update-${field}`}>
            <input 
                type={`${type}`}
                value={value}
                onChange={(e) => handleInputChange(field, e)}
                onBlur={(e) => handleBlur(field, e)}
                onKeyDown={(e) => handleKeys(field, e)}
                autoFocus
                className="border rounded text-center"
            />
            <input type="hidden" name={field} value={value} />
            <input type="hidden" name="id" value={product.id} />
        </fetcher.Form>
    )

    const openImage = () => {
        setIsImageOpen(true)
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            setIsZoomed(true);
        }, 0);
    }

    const closeImage = () => {
        setIsImageOpen(false)
        setIsZoomed(false)
        document.body.style.overflow = 'auto';
    }
    

    return (
        <>
        {isImageOpen && (
            <tr
                className={`z-10 fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-90 `}
                onClick={closeImage} // Cierra el div al hacer clic en el fondo
            >
                <td>
                    <div
                        className={` relative scale-50 transition-all ${isZoomed ? "zoom-class" : ""}`}
                        onClick={(e) => e.stopPropagation()} // Evita cerrar al hacer clic en la imagen
                    >
                        <img
                            className="max-w-2xl w-full rounded-lg"
                            src={`${import.meta.env.VITE_API_URL}/webp/${product.image}`}
                            alt={`Imagen ${product.name}`}
                        />
                    <ChangeImage 
                        product={product}
                    />
                    </div>
                    <XMarkIcon
                        className="absolute top-2 right-2 text-white w-10 cursor-pointer transition-all hover:text-gray-400"
                        onClick={closeImage}
                    />
                </td>
                
            </tr>
        )}

        <tr className="border-t text-center">
            <td className="p-3 text-lg text-gray-800">
                {product.id}
            </td>

            <td className="p-3 text-lg text-gray-800">
                <div className="flex justify-center">
                    <div className="h-20 w-20 flex">
                        <img 
                            className=" w-24 rounded-lg cursor-pointer object-cover" 
                            src={`${import.meta.env.VITE_API_URL}/webp/${product.image}`} 
                            alt={`Imagen ${product.name}`} 
                            onClick={openImage}
                        />
                    </div>
                </div>
            </td>

            <td className="p-3 text-lg text-gray-800">
                {editField === 'name' && isEditing ? (
                    customField("name", name, "string")
                    ) : (
                        <span
                        onDoubleClick={() => editingField('name')}
                            className="cursor-pointer p-2 rounded-xl hover:bg-red-100 transition"
                        >
                            {product.name}
                        </span>
                )}
            </td>

            <td className="p-3 text-lg text-gray-800">
                {editField === 'price' && isEditing ? (
                    customField("price", price, "string")
                    ) : (
                        <span
                            onDoubleClick={() => editingField('price')}
                            className="cursor-pointer p-2 rounded-xl hover:bg-red-100 transition"
                        >
                            {formatCurrency(product.price)}
                        </span>
                )}
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
                                showToast('Producto eliminado', 'success')
                            }
                        }}
                    >
                        <button type="submit">
                            <TrashIcon className="w-6 cursor-pointer text-red-700 hover:text-red-400" />
                        </button>
                    </Form>
                </div>
            </td>
        </tr>
        </>
    );
}