import express from 'express'
import router from './router'
import db from "./config/db"
import colors from 'colors'
import cors, {CorsOptions} from 'cors'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec, {swaggerUiOptions} from './config/swagger'

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
const CorsOptions : CorsOptions = {
    origin: function(origin, callback) {
        if(origin === 'http://localhost:5173') {
            console.log('permitir');
        } else {
            console.log('no permitir');
        }
    }
}

// Leer datos de formularios
server.use(express.json())

server.use('/api/products', router)

// Docs
server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions))

export default server
