import {Link, useLoaderData} from "react-router-dom"
import { PlusCircleIcon } from "@heroicons/react/24/solid"
import { getProducts } from "../services/ProductServices"
import { Product } from "../types"
import ProductDetails from "../components/ProductDetails"

export async function loaders() {
  const products = await getProducts()
  return products
}

export default function Products() {

  const products = useLoaderData() as Product[]

  return (
    <>
        <div className="flex justify-between">
            <h2 className=" text-slate-500 font-black text-2xl md:text-2xl xl:text-3xl">Productos</h2>

            <Link
                to={"productos/nuevo"}
                className="flex items-center"
            >
                <PlusCircleIcon className="w-8 h-8 text-slate-500 hover:text-slate-400 transition-all"/>
            </Link>
        </div>

        <div className="p-2">
          <table className="w-full mt-5 table-auto">
            <thead className="bg-slate-800 text-white">
                <tr>
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
                />
              ))}
            </tbody>
          </table>
        </div>
    </>
  )
}
