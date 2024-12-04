import { ActionFunctionArgs, redirect } from "react-router-dom"
import { deleteProduct, updateAvailability } from "./ProductServices"

export async function toggleAvailabilityAction({request} : ActionFunctionArgs) {
    const formData = await request.formData()
    const data = Object.fromEntries(formData)
    console.log(data);
    
    await updateAvailability(+data.id)
    return {}
}

export async function deleteProductAction({params} : ActionFunctionArgs) {
    if(params.id) {
        await deleteProduct(+params.id)
        return redirect('/')
    }
}