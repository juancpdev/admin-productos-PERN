import { ActionFunctionArgs, redirect } from "react-router-dom"
import { deleteProduct, updateAvailability, updateName, updatePrice } from "./ProductServices"

export async function toggleAvailabilityAction({request} : ActionFunctionArgs) {
    const formData = await request.formData()
    const data = Object.fromEntries(formData)
    
    await updateAvailability(+data.id)
    return {}
}

export async function updatePriceAction({request} : ActionFunctionArgs) {
    const formData = await request.formData()
    const data = Object.fromEntries(formData)
    
    await updatePrice(+data.id, +data.price)
    return {}
}

export async function updateNameAction({request} : ActionFunctionArgs) {
    const formData = await request.formData()
    const data = Object.fromEntries(formData)
    
    await updateName(+data.id, data.name.toString())
    return {}
}

export async function deleteProductAction({params} : ActionFunctionArgs) {
    if(params.id) {
        await deleteProduct(+params.id)
        return redirect('/')
    }
}