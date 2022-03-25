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
          name: {
            type: 'string',
            example: 'Steven Segal',
          },
          email: {
            type: 'string',
            example: 'example@gmail.com',
          },
          password: {
            type: 'string',
            example: 'yourpassword',
          },
          enabled: {
            type: 'boolean',
            example: true,
          },
          authority: {
            type: 'string',
            example: 'User',
          },
          alcohol: {
            type: 'string',
            example: 'Vodka',
          },
          tshirtSize: {
            type: 'string',
            example: 'XL',
          },
          createdAt: {
            type: 'string',
            example: '2022-03-25T13:09:57.063Z',
          },
          updatedAt: {
            type: 'string',
            example: '2022-03-25T13:09:57.063Z',
          },
          leadId: {
            type: 'string',
            format: 'uuid',
            example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
          },
          lead: {
            type: 'object',
            example: null,
          },
          celebration: {
            type: 'array',
            example: [],
          },
          timeOffs: {
            type: 'array',
            example: [],
          },
        },
      },
      UserInput: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: {
            type: 'string',
            example: 'Steven Segal',
          },
          email: {
            type: 'string',
            example: 'example@gmail.com',
          },
          password: {
            type: 'string',
            example: 'yourpassword',
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
            Authorization: [],
          },
        ],
        parameters: [
          {
            in: 'query',
            name: 'page',
            schema: {
              type: 'string',
              minimum: 0,
            },
          },
          {
            in: 'query',
            name: 'limit',
            schema: {
              type: 'string',
              minimum: 0,
            },
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
      post: {
        tags: ['users'],
        description: 'Creates new user',
        parameters: [
          {
            in: 'query',
            name: 'leadId',
            schema: {
              type: 'string',
              format: 'uuid',
              minimum: 0,
            },
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UserInput',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'User created.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
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
