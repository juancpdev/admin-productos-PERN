import { Form, Link} from "react-router-dom"
import { ArrowLeftCircleIcon } from "@heroicons/react/24/solid"
import { useForm } from "react-hook-form"
import Errors from "../components/Errors";
import { addProduct, ProductData } from "../services/ProductServices";


export default function NewProduct() {

    const { register, handleSubmit, formState: { errors } } = useForm();
    
    const onSubmit = (data : ProductData) => {
        // Manejar envío del formulario
        addProduct(data)
      };

    return (
        <>
            <div className="flex justify-between flex-col">
                <div className="flex justify-between">
                <h2 className=" text-slate-500 font-black text-2xl md:text-2xl xl:text-3xl">Nuevo Producto</h2>

                <Link
                    to={"/"}
                    className="flex items-center"
                >
                    <ArrowLeftCircleIcon className="w-8 h-8 text-slate-500 hover:text-slate-400 transition-all"/>
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
                            className="mt-2 block w-full p-3 bg-gray-50"
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
                            className="mt-2 block w-full p-3 bg-gray-50"
                            placeholder="Precio Producto. ej. 200, 300"
                            {...register('price', {required: 'El precio es obligatorio'})}
                        />
                        {errors.price && <Errors>{errors.price.message?.toString()}</Errors>}
                    </div>
                    <input
                    type="submit"
                    className="mt-5 w-full bg-indigo-600 p-2 text-white font-bold text-lg cursor-pointer rounded"
                    value="Registrar Producto"
                    />
                </Form>
            </div>
        </>
    )
}
