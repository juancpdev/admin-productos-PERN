import { array, boolean, number, object, string, InferOutput } from "valibot";

export const DraftProductSchema = object({
    name: string(),
    price: number(),
    image: string()
})

export const ProductSchema = object({
    id: number(),
    name: string(),
    price: number(),
    image: string(),
    availability: boolean()
})

export const ProductsSchema = array(ProductSchema)

export type Product = InferOutput<typeof ProductSchema>