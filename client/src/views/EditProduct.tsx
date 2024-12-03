import { Form, Link, LoaderFunctionArgs, redirect, useLoaderData, useNavigate} from "react-router-dom"
import { ArrowLeftCircleIcon } from "@heroicons/react/24/solid"
import { useForm } from "react-hook-form"
import Errors from "../components/Errors";
import { editProduct, getProductsById, ProductData } from "../services/ProductServices";
import 'react-toastify/dist/ReactToastify.css';
import { Product } from "../types";

export async function loaders({params} : LoaderFunctionArgs) {
    if(params.id !== undefined) {
        const product = await getProductsById(+params.id)
        if(!product) {
            return redirect('/')
        }
        return product
    }

}

const availabilityOptions = [
    {name: 'Disponible', value: true},
    {name: 'No disponible', value: false}
]

export default function EditProduct() {
    
    const navigate = useNavigate();
    const product : Product = useLoaderData()

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data: ProductData) => {
        try {
            await editProduct(data, product.id); // Lógica de edición
            navigate("/", { state: { showToast: true } }); // Pasar estado
        } catch (error) {
            console.error("Error editando el producto:", error);
        }
    };
    
    return (
        <>
            <div className="flex justify-between flex-col">
                <div className="flex justify-between">
                <h2 className=" text-slate-500 font-black text-2xl md:text-2xl xl:text-3xl">Editar Producto</h2>

                <Link
                    to={"/"}
                    className="flex items-center"
                >
                    <div className=" bg-slate-500 text-white flex justify-center items-center gap-1 px-2 py-1 rounded-xl transition-all hover:bg-slate-400">
                        <p>Volver</p>
                        <ArrowLeftCircleIcon className="h-7"/>
                    </div>
                </Link>
                </div>

                <Form 
                    onSubmit={handleSubmit(onSubmit)}
                    className="mt-10"
                    method="POST"
                >
                
                    <div className="mb-4">
                        <label
                            className="text-gray-800"
                            htmlFor="name"
                        >Nombre Producto:</label>
                        <input 
                            id="name"
                            type="text"
                            className="mt-2 block w-full p-3 bg-gray-100"
                            placeholder="Nombre del Producto"
                            defaultValue={product.name}
                            {...register('name', {required: 'El nombre es obligatorio'})}
                        />
                        {errors.name && <Errors>{errors.name.message?.toString()}</Errors>}
                    </div>
                    <div className="mb-4">
                        <label
                            className="text-gray-800"
                            htmlFor="price"
                        >Precio:</label>
                        <input 
                            id="price"
                            type="number"
                            className="mt-2 block w-full p-3 bg-gray-100"
                            placeholder="Precio Producto. ej. 200, 300"
                            defaultValue={product.price}
                            {...register('price', {required: 'El precio es obligatorio'})}
                        />
                        {errors.price && <Errors>{errors.price.message?.toString()}</Errors>}
                    </div>
                    <div className="mb-4">
                        <label
                            className="text-gray-800"
                            htmlFor="price"
                        >Disponibilidad:</label>
                        <select
                            id="availability"
                            className="mt-2 block w-full p-3 bg-gray-50"
                            defaultValue={product.availability.toString()}
                            {...register('availability')}
                        >
                            {availabilityOptions.map(availability => (
                                <option 
                                    key={availability.name}
                                    value={availability.value.toString()}
                                >
                                    {availability.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <input
                    type="submit"
                    className="mt-5 w-full bg-indigo-600 p-2 text-white font-bold text-lg cursor-pointer rounded transition hover:bg-indigo-700"
                    value="Guardar Cambios"
                    />
                </Form>
            </div>
        </>
    )
}
