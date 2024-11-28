import request from 'supertest'
import server from '../../server'

// Testing in POST and PUT
const testPriceValidation = (method : 'post' | 'put', url : string) => {
    it('should validate that the price is grater than 0', async () => {
        const response = await request(server)
            [method](url)
            .send({ 
                name: 'new name',
                availability: true,
                price: 0
            })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe("El precio del producto debe ser mayor a 0")

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })
}

// Testing in GET, PUT and DELETE
const idNotValidate = (method : 'get' | 'put' | 'patch' | 'delete', send?: object ) => {
    it('should check a valid ID in the URL', async () => {
        const response = await request(server)[method]('/api/products/not-valid-url').send(send)

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe("ID no válido")
    })
}

// Testing in GET, PUT, PATCH and DELETE
const productNonExist = (method : 'get' | 'put' | 'patch' | 'delete', send?: object ) => {
    it('should return 404 response for a non-exist product', async () => {
        const productId = 2000
        const response = await request(server)[method](`/api/products/${productId}`).send(send)

        expect(response.status).toBe(404)
        expect(response.body.error).toBe("Producto no encontrado")

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })
}

describe('POST /api/products', () => {
    it('should display validation errors', async () => {
        const response = await request(server).post('/api/products').send({})

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(4)
        
        expect(response.status).not.toBe(404)
    })

    testPriceValidation('post', "/api/products")

    it('should create a new product', async () => {
        const response = await request(server).post('/api/products').send({
            name: 'Zapas - Testing',
            price: 30
        })
        expect(response.status).toBe(201)
    })
})

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

describe('PUT /api/products/:id', () => {
    idNotValidate('put', { 
        name: 'new name',
        availability: true,
        price: 1000
    })

    it('should display validation error messages when updating a product', async () => {
        const response = await request(server)
            .put('/api/products/1')
            .send({})
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors).toHaveLength(5)

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    productNonExist('put', { 
        name: 'new name',
        availability: true,
        price: 300
    })

    it('should update an existing product with valid data', async () => {
        const response = await request(server)
            .put(`/api/products/1`)
            .send({ 
                name: 'new name',
                availability: true,
                price: 300
            })
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')

        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty('errors')
    })
})

describe('PATCH /api/products/:id', () => { 
    // Si hay errores a futuro borrar idNotValidate de PATCH (lo agregue ya haciendo la doc porq pense q me faltaba)
    idNotValidate('patch', { 
        availability: true,
    })

    productNonExist('patch', { 
        name: 'new name',
        availability: true,
        price: 300
    })

    it('should update the product availability', async () => {
        const response = await request(server).patch('/api/products/1')
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data.availability).toBe(false)

        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty('error')
    })
})

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