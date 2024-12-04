import { LoaderFunctionArgs, redirect } from "react-router-dom"
import { getProductsById } from "./ProductServices"

export async function loaders({params} : LoaderFunctionArgs) {
    
    if(params.id !== undefined) {
        const product = await getProductsById(+params.id)
        if(!product) {
            return redirect('/')
        }
        return product
    }

}