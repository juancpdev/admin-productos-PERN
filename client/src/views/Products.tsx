import {Link} from "react-router-dom"
import { PlusCircleIcon } from "@heroicons/react/24/solid"

export default function Products() {
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
    </>
  )
}
