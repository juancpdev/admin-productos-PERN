import { ActionFunctionArgs, redirect } from "react-router-dom"
import { deleteProduct, updateAvailability, updateImage, updateName, updatePrice } from "./ProductServices"
import { toast } from "react-toastify"

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

export async function updateImageAction({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    const id = formData.get("id");
    const image = formData.get("image");

    // Validación de los datos recibidos
    if (!id || isNaN(Number(id))) {
      throw new Error("ID no válido.");
    }

    if (!(image instanceof File)) {
      throw new Error("Imagen no válida.");
    }

    // Verificar que el archivo sea una imagen válida
    const validMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validMimeTypes.includes(image.type)) {
      return toast.error("Archivo no valido")
    }

    // Llamada a la función que actualiza la imagen
    await updateImage(Number(id), image);
    toast.success('Imagen Actualizada')
    return {
      success: true, // Esto indica al frontend que la carga fue exitosa
      redirectTo: "/" // Opcional, puedes redirigir aquí si lo necesitas
    };
    
    
    // Redirige correctamente a "/asdsa"
  } catch (error) {
    // Manejo de errores
    console.error("Error al actualizar la imagen:", error);
    return {
      success: false,
      error: "Error al actualizar la imagen"
    };
  }
}

  

export async function deleteProductAction({params} : ActionFunctionArgs) {
    if(params.id) {
        await deleteProduct(+params.id)
        return redirect('/')
    }
}