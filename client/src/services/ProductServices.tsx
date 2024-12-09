import { safeParse } from 'valibot'
import { Product, ProductSchema, ProductsSchema } from '../types/index'
import axios from 'axios'

export type ProductData = {
    name: FormDataEntryValue;
    price: FormDataEntryValue;
    image: File[];
};

export async function addProduct(data: ProductData) {
    try {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('price', data.price.toString());
        formData.append('image', data.image[0]);

        const url = `${import.meta.env.VITE_API_URL}/api/products`;
        await axios.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        
    } catch (error) {
        console.log(error);
        throw error; // Re-lanzamos el error para manejarlo en el componente
    }
}

export async function getProducts() {
    try {
        const url = `${import.meta.env.VITE_API_URL}/api/products`
        const { data }  = await axios(url)
        const result = safeParse(ProductsSchema, data.data )
        
        if(result.success) {
            return result.output
        } else {
            throw new Error("Hubo un error");
        }
        
    } catch (error) {
        console.log(error);
    }
}

export async function getProductsById(id : number) {
    try {
        const url = `${import.meta.env.VITE_API_URL}/api/products/${id}`
        const { data }  = await axios(url)
        const result = safeParse(ProductSchema, data.data )
        
        if(result.success) {
            return result.output
        } else {
            throw new Error("Hubo un error");
        }
        
    } catch (error) {
        console.log(error);
    }
}

export async function updateAvailability(id : Product['id']) {

    try {
        const url = `${import.meta.env.VITE_API_URL}/api/products/availability/${id}`
        await axios.patch(url)
    } catch (error) {
        console.log(error);
    }
}

export async function updatePrice(id: Product['id'], newPrice: number) {
    try {
        const url = `${import.meta.env.VITE_API_URL}/api/products/price/${id}`;
        await axios.patch(url, { price: newPrice });
    } catch (error) {
        console.log(error);
    }
}

export async function updateName(id: Product['id'], newName: string) {
    try {
        const url = `${import.meta.env.VITE_API_URL}/api/products/name/${id}`;
        await axios.patch(url, { name: newName });
    } catch (error) {
        console.log(error);
    }
}

export async function deleteProduct(id : Product['id']) {

    try {
        const url = `${import.meta.env.VITE_API_URL}/api/products/${id}`
        await axios.delete(url)
    } catch (error) {
        console.log(error);
    }
}