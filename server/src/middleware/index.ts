import {Request, Response, NextFunction} from "express"
import { validationResult } from "express-validator"
import multer from 'multer'
import path from 'path';
import fs from 'fs';

// Crear el directorio uploads si no existe
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

export const handleInputErrors = (req : Request, res : Response, next : NextFunction) => {
    
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() })
        return
    }
    next()
}

// Configuración de multer para la carga de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Aquí defines el directorio donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);  // Extensión del archivo (por ejemplo, .jpg, .png)
        const filename = Date.now() + ext;  // Nombre único para el archivo
        cb(null, filename);
    }
});

// Configuración de multer
const upload = multer({ storage });

// Exportar el middleware upload
export { upload };