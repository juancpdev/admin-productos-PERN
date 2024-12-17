import { getProducts } from "./ProductServices"

export async function productsLoaders() {
    const products = await getProducts()
    return products
  }
  