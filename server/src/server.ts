import express from 'express'
import router from './router'
import db from "./config/db"
import colors from 'colors'
import cors, {CorsOptions} from 'cors'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec, {swaggerUiOptions} from './config/swagger'
import morgan from 'morgan'

// Conectar a la BD
export async function connectDB() {
    try {
        await db.authenticate()
        db.sync()
        // console.log( colors.bgGreen.bold('Conexion exitosa a la BD'));
        
    } catch (error) {
        //  console.log(error);
        console.log( colors.bgRed.bold('No se pudo conectar con la BD'));
    }
}
connectDB()

// Instancia de express
export const server  = express()

// Permitir conexiones
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:4000'
];
 
const CorsOptions : CorsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            // Denegar acceso si el origen no está en la lista
            callback(new Error('Error de CORS: Dominio no autorizado'));
        }
    }
};
 
server.use(cors(CorsOptions))

// Leer datos de formularios
server.use(express.json())

server.use('/uploads', express.static('uploads'));
server.use('/webp', express.static('webp'));

server.use(morgan('dev'))
server.use('/api/products', router)

// Docs
server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions))

export default server
