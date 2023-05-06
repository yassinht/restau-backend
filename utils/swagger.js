const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: "Scores Application API's",
      version: '2.0.0',
      description: 'API documentation for Your API',
    },
    servers: [
      {
        url: 'http://localhost:8000',
        description: 'Development server',
      },
      {
        url: 'http://185.104.172.119:3001/',
        description: 'Production server',
      },
    ],
  },
  apis: ['./routes/*.js'], // Replace with the path to your routes directory
};

const specs = swaggerJsdoc(options);

module.exports = specs;