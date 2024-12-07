import { Request, Response } from "express"
import Product from "../models/Product.model";

export const getProduct = async (req : Request, res : Response) => {
    const products = await Product.findAll({
        order:  [
            ['id', 'ASC'],
        ]
    })
    res.json({data : products})
}

export const getProductById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
        res.status(404).json({ error: 'Producto no encontrado' });
        return 
    }
    res.json({ data: product });
}

export const createProduct = async (req : Request, res : Response) => {
    const product = await Product.create(req.body)
    res.status(201).json({data: product})
}

export const updateAvailability = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);

        if (!product) {
            res.status(404).json({ error: 'Producto no encontrado' });
            return 
        }

        product.availability = !product.availability;
        await product.save();

        res.json({ data: product });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export const updatePrice = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { price } = req.body;

        const product = await Product.findByPk(id);

        if (!product) {
            res.status(404).json({ error: 'Producto no encontrado' });
            return 
        }

        product.price = price;
        await product.save();

        res.json({ data: product });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export const updateName = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const product = await Product.findByPk(id);

        if (!product) {
            res.status(404).json({ error: 'Producto no encontrado' });
            return 
        }

        product.name = name;
        await product.save();

        res.json({ data: product });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export const deleteProduct = async (req : Request, res : Response)  => {
    try {
        const { id } = req.params
        const product = await Product.findByPk(id)
        
        if(!product) {
            res.status(404).json({
                error: 'Producto no encontrado'
            })
            return
        }

        await product.destroy()
        res.json({data: 'Producto Eliminado'})

    } catch (error) {
        console.log(error);
    }
}