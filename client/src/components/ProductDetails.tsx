import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Product } from "../types";
import { formatCurrency } from "../utils";
import { ActionFunctionArgs, Form, Link, redirect, useFetcher } from "react-router-dom";
import { deleteProduct } from "../services/ProductServices";
import Swal from "sweetalert2";

type ProductDetailsProp = {
    product: Product
}

export async function action({params} : ActionFunctionArgs) {
    if(params.id) {
        await deleteProduct(+params.id)
        return redirect('/')
    }
}

export default function ProductDetails({product} : ProductDetailsProp) {
    const fetcher = useFetcher()

    const isAvailability = product.availability

    return (
        <tr className="border-b text-center">
            <td className="p-3 text-lg text-gray-800">
                {product.name}
            </td>

            <td className="p-3 text-lg text-gray-800">
                { formatCurrency(product.price) }
            </td>

            <td className="p-3 text-lg text-gray-800">
                {isAvailability ? 'Disponible' : 'No Disponible'}
            </td>
            
            <td className="p-3 text-lg text-gray-800">
                <div className="flex gap-5 justify-center">
                    <Link
                        to={`/productos/editar/${product.id}`}
                    >
                        <PencilSquareIcon className=" w-6 cursor-pointer hover:text-gray-500 transition-all" />
                    </Link>
                    <Form
                        method="POST"
                        action={`productos/eliminar/${product.id}`}
                        onSubmit={ async (e) => {
                            e.preventDefault() // Evita el envío inmediato del formulario
                            const result = await Swal.fire({
                                title: "¿Quieres eliminar el producto?",
                                text: "No podrás revertir esto.",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#3085d6",
                                cancelButtonColor: "#d33",
                                confirmButtonText: "Sí, eliminar",
                                cancelButtonText: "Cancelar",
                            })
                     
                            if (result.isConfirmed) {
                                fetcher.submit(e.target as HTMLFormElement)
                            }
                        }}
                    >
                        <button type="submit">
                            <TrashIcon className="w-6 cursor-pointer hover:text-gray-500" />
                        </button>
                    </Form>
                </div>
            </td>
        </tr> 
    )
}
