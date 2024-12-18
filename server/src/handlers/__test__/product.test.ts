import request from 'supertest'
import server from '../../server'
import fs from 'fs';
import path from 'path';

afterAll(async () => {
    // Limpiar después de todos los tests
    const uploadDir = path.join(__dirname, '..', '..', '..', 'uploads');
    console.log("Limpieza de archivos en: " + uploadDir);
    deleteFilesInDirectory(uploadDir);  // Llama a la función de limpieza
    console.log('Archivos eliminados correctamente');
});

const deleteFilesInDirectory = (directory: string) => {
    if (fs.existsSync(directory)) {
        const files = fs.readdirSync(directory);
        files.forEach(file => {
            const filePath = path.join(directory, file);
            if (fs.lstatSync(filePath).isDirectory()) {
                deleteFilesInDirectory(filePath);  // Recursión
            } else {
                fs.unlinkSync(filePath);  // Elimina el archivo
            }
        });
    } else {
        console.log(`La carpeta ${directory} no existe.`);
    }
};

const uploadImageTest = () => {
    const testImageSource = path.join(__dirname, 'img-test.png'); // Ruta de una imagen realZZ
    const imagePath = path.join(__dirname, '..', '..', '..', 'uploads', 'img-test.png');
    
    // Asegúrate de copiar una imagen real
    fs.copyFileSync(testImageSource, imagePath);

    return imagePath
}

// Testing in GET and DELETE
const idNotValidate = (method : 'get' | 'delete', send?: object ) => {
    it('should check a valid ID in the URL', async () => {
        const response = await request(server)[method]('/api/products/not-valid-url').send(send)

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe("ID no válido")
    })
}

// Testing in GET and DELETE
const productNonExist = (method : 'get' | 'delete', send?: object ) => {
    it('should return 404 response for a non-exist product', async () => {
        const productId = 2000
        const response = await request(server)[method](`/api/products/${productId}`).send(send)

        expect(response.status).toBe(404)
        expect(response.body.error).toBe("Producto no encontrado")

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })
}

// -------------------------------------- POST ------------------------------------------

describe('POST /api/products', () => {

    it('should validate that the price is grater than 0', async () => {
        const imagePath = uploadImageTest()

        // Realiza la solicitud POST simulando la subida de archivo
        const response = await request(server)
            .post("/api/products")
            .set('Content-Type', 'multipart/form-data')
            .field('name', 'new name')
            .field('price', 0)
            .field('availability', true)
            .attach('image', imagePath);

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe("El precio del producto debe ser mayor a 0")

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')

        // Limpia el archivo simulado después de los tests
        fs.unlinkSync(imagePath);
    })

    it('should display validation errors', async () => {
        const response = await request(server).post('/api/products').send({})

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(5)
        
        expect(response.status).not.toBe(404)
    })

    it('should create a new product', async () => {
        const imagePath = uploadImageTest()
            
        const response = await request(server)
            .post('/api/products')
            .set('Content-Type', 'multipart/form-data')
            .field('name', 'Zapas - Testing')
            .field('price', 30)
            .attach('image', imagePath); // Adjunta el archivo simulado
            
        expect(response.status).toBe(201)

        fs.unlinkSync(imagePath);
    })
})

// -------------------------------------- GET ------------------------------------------

describe('GET /api/products', () => {
    it('should check if api/products url exist', async () => {
        const response = await request(server).get('/api/products')
        expect(response.status).not.toBe(404)
    })

    it('GET a JSON response with products', async () => {
        const response = await request(server).get('/api/products')

        expect(response.status).toBe(200)
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveLength(1)
        expect(response.body).not.toHaveProperty('errors')
    })
})

describe('GET /api/products/:id', () => {
    idNotValidate('get')

    productNonExist('get')

    it('get a JSON response for a single product', async () => {
        const response = await request(server).get('/api/products/1')
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
    })
})

// -------------------------------------- PATCH ------------------------------------------

const patchGeneral = (type: string, data: number | string | boolean, errors? : number) => {
    describe(`PATCH /api/products/${type}/:id`, () => {
        
        it('should check a valid ID in the URL', async () => {
            const response = await request(server).patch(`/api/products/${type}/not-valid-url/`).send({ [type]: data });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('errors');
            expect(response.body.errors).toHaveLength(1);
            expect(response.body.errors[0].msg).toBe("ID no válido");
        });

        it('should return 404 response for a non-exist product', async () => {
            const productId = 2000; // Un ID que no exista
            const response = await request(server).patch(`/api/products/${type}/${productId}`).send({ 
                name: 'new name',
                availability: true,
                price: 300
            });

            expect(response.status).toBe(404);
            expect(response.body.error).toBe("Producto no encontrado");
            expect(response.body).not.toHaveProperty('data');
        });

        if(type === 'availability') {
            it('should update the product availability', async () => {
                const response = await request(server).patch('/api/products/availability/1')
                expect(response.status).toBe(200)
                expect(response.body).toHaveProperty('data')
                expect(response.body.data.availability).toBe(false)
        
                expect(response.status).not.toBe(404)
                expect(response.status).not.toBe(400)
                expect(response.body).not.toHaveProperty('error')
            })
        } else {
            it('should display validation errors', async () => {
                const response = await request(server).patch(`/api/products/${type}/1`).send({});
    
                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty('errors');
                expect(response.body.errors).toHaveLength(errors); // Ajusta este valor según las validaciones de tu backend
                expect(response.status).not.toBe(404);
            });
        }
    });
};

patchGeneral('price', 500, 3);
patchGeneral('name', 'Uptempo', 1);
patchGeneral('availability', true);



describe(`PATCH /api/products/image/:id`, () => {
    
    it('should check a valid ID in the URL', async () => {
        const imagePath = uploadImageTest()
        const response = await request(server)
            .patch(`/api/products/image/:id`)
            .set('Content-Type', 'multipart/form-data')
            .attach('image', imagePath);
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toHaveLength(1);
        expect(response.body.errors[0].msg).toBe("ID no válido");
    });

    it('should return 404 response for a non-exist product', async () => {
        const imagePath = uploadImageTest()
        const productId = 2000; // Un ID que no exista
        const response = await request(server)
            .patch(`/api/products/image/${productId}`)
            .set('Content-Type', 'multipart/form-data')
            .attach('image', imagePath);
        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Producto no encontrado");
        expect(response.body).not.toHaveProperty('data');
    });
});


// -------------------------------------- DELETE ------------------------------------------

describe('DELETE /api/products/:id', () => { 
    idNotValidate('delete')

    productNonExist('delete')

    it('should delete a product', async () => {
        const response = await request(server).delete('/api/products/1')
        expect(response.status).toBe(200)
        expect(response.body.data).toBe("Producto Eliminado")

        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(400)

    })
})