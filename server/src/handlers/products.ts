import { Request, Response } from "express"
import Product from "../models/Product.model";
import sharp from 'sharp';
import path from 'path';
import fs from "fs/promises";
import fss from "fs";

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

export const createProduct = async (req: Request, res: Response) => {
    const { name, price } = req.body;
    const originalPath = req.file.path; // Ruta del archivo cargado
    const webpFolderPath = './webp';
    const outputPath = path.join(
        webpFolderPath,
        `${path.parse(originalPath).name}.webp`
    );

    try {
        // Verificar si la carpeta `webp` existe, y crearla si no
        if (!fss.existsSync(webpFolderPath)) {
            fss.mkdirSync(webpFolderPath, { recursive: true });
        }
        
        // Procesar el archivo con sharp
        await sharp(originalPath)
        .webp({quality: 80})
        .toFile(outputPath)

        // Crear el producto en la base de datos
        const product = await Product.create({
            name,
            image: `${path.parse(originalPath).name}.webp`, // Guardar el nuevo nombre
            price,
        });

        // Enviar la respuesta al cliente
        res.status(201).json({ data: product });


    } catch (error) {
        console.error('Error al crear el producto o procesar la imagen:', error);
        res.status(500).json({ error: 'Error al crear el producto o procesar la imagen' });
    }
};

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

export const updateImage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const originalPath = req.file.path; // Ruta del archivo cargado
        const newImage = `${path.parse(originalPath).name}.webp`
        const outputPath = path.join(
            './webp',
            `${path.parse(originalPath).name}.webp`
        );
        // Procesar el archivo con sharp
        await sharp(originalPath)
        .webp({quality: 80})
        .toFile(outputPath)
        const product = await Product.findByPk(id);

        if (!product) {
            res.status(404).json({ error: 'Producto no encontrado' });
            return 
        }

        const oldImage = product.image
        const imageWebpPath = path.join("webp", oldImage)

        product.image = newImage;

        try {
            await fs.unlink(imageWebpPath).catch(() => {}); // Ignorar errores si no existe
        } catch (err) {
            console.error("Error al eliminar las imágenes:", err);
        }

        await product.save();
        res.json({data: 'Imagen Actualizada'})
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

        const imageRelativePath = product.image
        const imageWebpPath = path.join("webp", imageRelativePath)

        try {
            await fs.unlink(imageWebpPath).catch(() => {}); // Ignorar errores si no existe
        } catch (err) {
            console.error("Error al eliminar las imágenes:", err);
        }
        
        await product.destroy()
        res.json({data: 'Producto Eliminado'})

    } catch (error) {
        console.log(error);
    }
}