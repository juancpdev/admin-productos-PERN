import { Router } from "express";
import { createProduct, deleteProduct, getProduct, getProductById, updateAvailability, updatePrice, updateProduct } from "./handlers/products";
import { body, param } from "express-validator";
import { handleInputErrors } from "./middleware";


const router =  Router();

/**
 * @swagger
 * components:
 *      schemas:
 *          Product:
 *              type: object
 *              properties:
 *                  id:
 *                      type: integer
 *                      description: The Product ID
 *                      example: 1
 *                  name:
 *                      type: string
 *                      description: The Product name
 *                      example: Uptempo Black and Withe
 *                  price:
 *                      type: number
 *                      description: The Product price
 *                      example: 160
 *                  availability:
 *                      type: boolean
 *                      description: The Product availability
 *                      example: true
 */

/**
 * @swagger
 * /api/products:
 *      get:
 *          summary: Get a list of products
 *          tags:
 *              - Products
 *          description: Return a list of products
 *          responses:
 *              200:
 *                  description: Successful response
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/Product'
 */
router.get('/', getProduct)

/**
 * @swagger
 * /api/products/{id}:
 *      get:
 *          summary: Get a product by ID
 *          tags:
 *              - Products
 *          description: Return a products based on its unique ID
 *          parameters:
 *            - in: path
 *              name: id
 *              description: The ID of the product to retrieve
 *              required: true
 *              schema:
 *                  type: integer
 *          responses:
 *              200:
 *                  description: Successful response
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Product'
 *              404:
 *                  description: Not found
 *              400:
 *                  description: Bad Request - Invalid ID
 */
router.get('/:id', 
    param('id').isInt().withMessage('ID no válido'),
    handleInputErrors,
    getProductById
)

/**
 * @swagger
 * /api/products/:
 *      post:
 *          summary: Creates a new product
 *          tags:
 *              - Products
 *          description: Return a new record in the database
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties: 
 *                              name:
 *                                  type: string
 *                                  example: "Uptempo Black and Withe"
 *                              price:
 *                                  type: number
 *                                  example: 350
 *          responses:
 *              201:
 *                  description: Product created successfully
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Product'
 *              400:
 *                  description: Bad Request - invalid input data
 */
router.post('/', 
    // Validacion
    body('name') 
        .notEmpty().withMessage('El nombre del producto no puede ir vacio'),
    body('price')
        .isNumeric().withMessage('Valor no valido')
        .notEmpty().withMessage('El precio del producto no puede ir vacio')
        .custom(price  => price > 0).withMessage('El precio del producto debe ser mayor a 0'),
    handleInputErrors,
    createProduct
)

/**
 * @swagger
 * /api/products/{id}:
 *      put:
 *          summary: Update a product with user input
 *          tags:
 *              - Products
 *          description: Return the updated product
 *          parameters:
 *            - in: path
 *              name: id
 *              description: The ID of the product to retrieve
 *              required: true
 *              schema:
 *                  type: integer
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties: 
 *                              name:
 *                                  type: string
 *                                  example: "Uptempo Black and Withe"
 *                              price:
 *                                  type: number
 *                                  example: 350
 *                              availability:
 *                                  type: boolean
 *                                  example: true
 *          responses:
 *              200:
 *                  description: Product updated successfully
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Product'
 *              400:
 *                  description: Bad Request - invalid input data
 *              404:
 *                  description: Not found
 */
router.put('/:id', 
    param('id').isInt().withMessage('ID no válido'),
    body('name')
        .notEmpty().withMessage('El nombre del producto no puede ir vacio'),
    body('price')
        .isNumeric().withMessage('Valor no valido')
        .notEmpty().withMessage('El precio del producto no puede ir vacio')
        .custom(price  => price > 0).withMessage('El precio del producto debe ser mayor a 0'),
    body('availability')
        .isBoolean().withMessage('Valor para disponibilidad no válido'),
    handleInputErrors,
    updateProduct
)

/**
 * @swagger
 * /api/products/availability/{id}:
 *      patch:
 *          summary: Update Product availability
 *          tags:
 *              - Products
 *          description: Return the updated availability
 *          parameters:
 *            - in: path
 *              name: id
 *              description: The ID of the product to retrieve
 *              required: true
 *              schema:
 *                  type: integer
 *          responses:
 *              200:
 *                  description: Product availability successfully
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Product'
 *              400:
 *                  description: Bad Request - invalid input data
 *              404:
 *                  description: Not found
 */
router.patch('/availability/:id', 
    param('id').isInt().withMessage('ID no válido'),
    handleInputErrors,
    updateAvailability
)

/**
 * @swagger
 * /api/products/price/{id}:
 *      patch:
 *          summary: Update Product price
 *          tags:
 *              - Products
 *          description: Return the updated price
 *          parameters:
 *            - in: path
 *              name: id
 *              description: The ID of the product to retrieve
 *              required: true
 *              schema:
 *                  type: integer
 *          responses:
 *              200:
 *                  description: Product price successfully
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Product'
 *              400:
 *                  description: Bad Request - invalid input data
 *              404:
 *                  description: Not found
 */
router.patch('/price/:id', 
    param('id').isInt().withMessage('ID no válido'),
    handleInputErrors,
    updatePrice
)

/**
 * @swagger
 * /api/products/{id}:
 *      delete:
 *          summary: Deletes a product by a given ID
 *          tags:
 *              - Products
 *          description: Returns a confirmation message
 *          parameters:
 *            - in: path
 *              name: id
 *              description: The ID of the product to delete
 *              required: true
 *              schema:
 *                  type: integer
 *          responses:
 *              200:
 *                  description: Product deleted successfully
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: string
 *                              value: 'Producto Eliminado'
 *              400:
 *                  description: Bad Request - invalid input data
 *              404:
 *                  description: Not found
 */
router.delete('/:id',     
    param('id').isInt().withMessage('ID no válido'),
    handleInputErrors,
    deleteProduct
)


export default router;
