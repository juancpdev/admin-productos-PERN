import { Form, Link} from "react-router-dom"
import { ArrowLeftCircleIcon } from "@heroicons/react/24/solid"
import { useForm } from "react-hook-form"
import Errors from "../components/Errors";
import { addProduct, ProductData } from "../services/ProductServices";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function NewProduct() {

    const { register, handleSubmit, formState: { errors }, reset } = useForm<ProductData>();
    
    const onSubmit = async (data: ProductData) => {
        try {
            await addProduct(data);
            toast.success('Producto agregado');
            reset();
        } catch (error) {
            toast.error('Error al agregar el producto');
            console.error(error);
        }
    };

    return (
        <>
            <div className="flex justify-between flex-col">
                <ToastContainer/>
                <div className="flex justify-between">
                <h2 className=" text-slate-500 font-black text-2xl md:text-2xl xl:text-3xl">Nuevo Producto</h2>

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
                            {...register('price', {required: 'El precio es obligatorio'})}
                        />
                        {errors.price && <Errors>{errors.price.message?.toString()}</Errors>}
                    </div>
                    <div className="mb-4">
                        <label
                            className="text-gray-800"
                            htmlFor="image"
                        >Imagen:</label>
                        <input 
                            id="image"
                            type="file"
                            accept="image/*"
                            className="mt-2 block w-full p-3 bg-gray-100"
                            placeholder="Precio Producto. ej. 200, 300"
                            {...register('image', {required: 'La imagen es obligatoria'})}
                        />
                        {errors.image && <Errors>{errors.image.message?.toString()}</Errors>}
                    </div>
                    <input
                    type="submit"
                    className="mt-5 w-full bg-indigo-600 p-2 text-white font-bold text-lg cursor-pointer rounded transition hover:bg-indigo-700"
                    value="Registrar Producto"
                    />
                </Form>
            </div>
        </>
    )
}
