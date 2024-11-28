import swaggerJSDoc from "swagger-jsdoc";
import { SwaggerUiOptions } from "swagger-ui-express";

const options : swaggerJSDoc.Options = {
    swaggerDefinition: {
        openapi: '3.0.2',
        tags: [
            {
                name: 'Products',
                description: 'API operations related to products'
            }
        ],
        info: {
            title: 'Rest API Node.js / Express / TypeScript',
            version: '1.0.0',
            description: 'API Docs for products',
        }
    },
    apis: ['./src/router.ts']
}
const swaggerSpec = swaggerJSDoc(options)

const swaggerUiOptions : SwaggerUiOptions = {
    customCss :  `
        .topbar-wrapper .link {
            content: url('https://jpdeveloper.netlify.app/build/img/logo.webp');
            width: 2px;
            padding: 20px 0;
        }
        .topbar-wrapper {
            width: 200px;
        }
    `,
    customSiteTitle: 'Documentacion REST API Express / TypeScript',
    customfavIcon: 'https://jpdeveloper.netlify.app/build/img/favicon2.png'
}

export default swaggerSpec
export { swaggerUiOptions }