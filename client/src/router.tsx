import { createBrowserRouter } from "react-router-dom";
import Layout from "./layouts/Layout";
import Products, { loaders as productsLoader, action as productsAction } from "./views/Products";
import NewProduct from "./views/NewProduct";
import { deleteProductAction, toggleAvailabilityAction, updatePriceAction } from "./services/ProductActions";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Products />,
                loader: productsLoader,
                action: productsAction,
                hydrateFallbackElement: <p>Cargando...</p>
            },
            {
                path: "toggle-availability",
                action: toggleAvailabilityAction,
            },
            {
                path: "update-price",
                action: updatePriceAction,
            },
            {
                path: "productos/nuevo",
                element: <NewProduct />
            },
            {
                path: "productos/eliminar/:id",
                action: deleteProductAction
            }
        ]
    }
])