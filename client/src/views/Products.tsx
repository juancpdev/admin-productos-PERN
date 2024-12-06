import {ActionFunctionArgs, Link, useLoaderData} from "react-router-dom"
import { PlusCircleIcon } from "@heroicons/react/24/solid"
import { getProducts, updateAvailability } from "../services/ProductServices"
import { Product } from "../types"
import ProductDetails from "../components/ProductDetails"
import { useMemo } from "react"
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

export async function loaders() {
  const products = await getProducts()
  return products
}

export async function action({request} : ActionFunctionArgs) {
  const formData = await request.formData()
  const data = Object.fromEntries(formData)
  await updateAvailability(+data.id)
  return {}
}

export default function Products() {

  const showToast = (message : string) => {
    console.log('alerta adentro');
    
    toast.success(message);
  };

  const products = useLoaderData() as Product[]

  const isEmpty = useMemo(() => products.length > 0, [products])

  return (
    <>
        <div className="flex justify-between">
            <h2 className=" text-slate-500 font-black text-2xl md:text-2xl xl:text-3xl">Productos</h2>

            <Link
                to={"productos/nuevo"}
                className="flex items-center"
                > 
                <div className=" bg-slate-500 text-white flex justify-center items-center gap-1 px-2 py-1 rounded-xl transition-all hover:bg-slate-400">
                  <p>Agregar</p>
                  <PlusCircleIcon className="h-7"/>
                </div>
            </Link>
        </div>

        <ToastContainer/>

        <div className="pt-2">
          <table className="w-full mt-5 table-auto shadow-md rounded-xl bg-white">
            <thead className="bg-slate-800 text-white">
                <tr>
                    <th className="p-2">ID</th>
                    <th className="p-2">Producto</th>
                    <th className="p-2">Precio</th>
                    <th className="p-2">Disponibilidad</th>
                    <th className="p-2">Acciones</th>
                </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <ProductDetails
                  key={product.id}
                  product={product}
                  showToast={showToast}
                />
              ))}
            </tbody>
          </table>
          {!isEmpty ? <p className="text-center mt-10 text-lg">Aún no hay productos</p> : null}
        </div>
    </>
  )
}
