import { createBrowserRouter } from "react-router-dom";
import Layout from "./layouts/Layout";
import Products, { loaders as productsLoader, action as productsAction } from "./views/Products";
import NewProduct from "./views/NewProduct";
import EditProduct, { loaders as editProductLoader } from "./views/EditProduct";
import { action as deleteProductAction } from "./components/ProductDetails";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Products />,
                loader: productsLoader,
                action: productsAction
            },
            {
                path: "productos/nuevo",
                element: <NewProduct />
            },
            {
                path: "productos/editar/:id",
                element: <EditProduct />,
                loader: editProductLoader
            },
            {
                path: "productos/eliminar/:id",
                action: deleteProductAction
            }
        ]
    }
])