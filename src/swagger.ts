export default {
  openapi: '3.0.0',
  components: {
    securitySchemes: {
      Authorization: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
          },
        },
      },
    },
  },
  info: {
    version: '1.0.0',
    title: 'GenericSoft',
    description: 'ERP Rest API',
    contact: {
      email: 'ivankraev122@gmail.com',
    },
    servers: [`http://localhost:${4000}`],
  },
  paths: {
    '/users': {
      get: {
        tags: ['users'],
        security: [
          {
            Authorization: ['JWT'],
          },
        ],
        description: 'Returns all users from the system that the user has access to',
        responses: {
          '200': {
            description: 'A list of users.',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  $ref: '#/components/schemas/User',
                },
              },
            },
          },
        },
      },
    },
  },
}
