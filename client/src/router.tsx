import { createBrowserRouter } from "react-router-dom";
import Layout from "./layouts/Layout";
import Products from "./views/Products";
import NewProduct from "./views/NewProduct";
import { deleteProductAction, toggleAvailabilityAction, updateImageAction, updateNameAction, updatePriceAction } from "./services/ProductActions";
import { productsLoaders } from "./services/ProductLoaders";
import { PulseLoader } from "react-spinners";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Products />,
                loader: productsLoaders,
                action: toggleAvailabilityAction,
                hydrateFallbackElement: 
                <div className="flex justify-center">
                    <PulseLoader color="#1E293B" />
                </div>
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
                path: "update-name",
                action: updateNameAction,
            },
            {
                path: "update-image",
                action: updateImageAction,
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