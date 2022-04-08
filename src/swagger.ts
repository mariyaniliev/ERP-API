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
            example: null,
          },
          lead: {
            type: 'object',
            $ref: '#/components/schemas/Lead',
          },
          celebration: {
            type: 'array',
            example: [],
          },
          timeOffRemainingDays: {
            type: 'number',
            example: 22,
          },
        },
      },
      UserInput: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            required: true,
            example: 'Steven Segal',
          },
          email: {
            type: 'string',
            required: true,
            example: 'example@gmail.com',
          },
          password: {
            type: 'string',
            required: true,
            example: 'yourpassword',
          },
        },
      },
      Celebration: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
          },
          occasion: {
            type: 'string',
            example: 'birthday',
          },
          startDate: {
            type: 'string',
            example: '2022-03-25T22:24:35+02:00',
          },
          enabled: {
            type: 'boolean',
            example: true,
          },
          authority: {
            type: 'string',
            example: 'User',
          },
          userId: {
            type: 'string',
            format: 'uuid',
            example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
          },
          user: {
            type: 'object',
            $ref: '#/components/schemas/User',
          },
          createdAt: {
            type: 'string',
            example: '2022-03-25T13:09:57.063Z',
          },
          updatedAt: {
            type: 'string',
            example: '2022-03-25T13:09:57.063Z',
          },
        },
      },
      CelebrationInput: {
        type: 'object',
        properties: {
          occasion: {
            type: 'string',
            required: true,
            example: 'birthday',
          },
          startDate: {
            type: 'string',
            required: true,
            example: '2022-03-25T22:52:27+02:00',
          },
          enabled: {
            type: 'boolean',
            required: true,
            example: true,
          },
        },
      },
      Lead: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
          },
          createdAt: {
            type: 'string',
            example: '2022-03-25T13:09:57.063Z',
          },
          userId: {
            type: 'string',
            format: 'uuid',
            example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
          },
          leadInfo: {
            type: 'object',
            $ref: '#/components/schemas/User',
          },
          team: {
            type: 'array',
            example: [],
          },
        },
      },
      TimeOff: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
          },
          endDate: {
            type: 'string',
            example: '2022-03-25T22:24:35+02:00',
          },
          startDate: {
            type: 'string',
            example: '2022-03-25T22:24:35+02:00',
          },
          approved: {
            type: 'boolean',
            example: true,
          },
          uploaded: {
            type: 'boolean',
            example: true,
          },
          type: {
            type: 'string',
            example: 'paid',
          },
          user: {
            type: 'object',
            $ref: '#/components/schemas/User',
          },
          createdAt: {
            type: 'string',
            example: '2022-03-25T13:09:57.063Z',
          },
          updatedAt: {
            type: 'string',
            example: '2022-03-25T13:09:57.063Z',
          },
        },
      },
      TimeOffInput: {
        type: 'object',
        properties: {
          startDate: {
            type: 'string',
            required: true,
            example: '2022-03-25T22:24:35+02:00',
          },
          endDate: {
            type: 'string',
            required: true,
            example: '2022-03-25T22:24:35+02:00',
          },
          approved: {
            type: 'boolean',
            required: true,
            example: true,
          },
          uploaded: {
            type: 'boolean',
            required: true,
            example: true,
          },
          type: {
            type: 'string',
            required: true,
            example: 'paid',
          },
        },
      },
      Session: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
          },
          valid: {
            type: 'boolean',
            example: true,
          },
          userId: {
            format: 'uuid',
            example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
          },
          userAgent: {
            type: 'string',
            example: 'Google Chrome',
          },
          createdAt: {
            type: 'string',
            example: '2022-03-25T13:09:57.063Z',
          },
          updatedAt: {
            type: 'string',
            example: '2022-03-25T13:09:57.063Z',
          },
        },
      },
      SessionInput: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            required: true,
            example: 'Steven.Segal@gmail.com',
          },
          password: {
            type: 'string',
            required: true,
            example: 'yourpassword',
          },
          name: {
            type: 'string',
            required: true,
            example: 'Steven Segal',
          },
        },
      },
    },
  },
  info: {
    version: '1.0.0',
    title: 'GenericSoft API',
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
          '403': {
            description: 'Authentication token is not valid.',
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
    '/users/{id}': {
      get: {
        tags: ['users'],
        security: [
          {
            Authorization: [],
          },
        ],
        parameters: [
          {
            in: 'path',
            name: 'id',
            schema: {
              type: 'string',
              required: true,
              format: 'uuid',
            },
          },
        ],
        description: 'Returns a single users from the system',
        responses: {
          '200': {
            description: 'User object.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  $ref: '#/components/schemas/User',
                },
              },
            },
          },
          '403': {
            description: 'Authentication token is not valid.',
          },
          '404': {
            description: 'User is not found.',
          },
          '409': {
            description: 'User already exist.',
          },
        },
      },
      patch: {
        tags: ['users'],
        description: 'Update user',
        security: [
          {
            Authorization: [],
          },
        ],
        required: ['id'],
        parameters: [
          {
            in: 'query',
            name: 'leadId',
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
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
            description: 'User updated.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  $ref: '#/components/schemas/User',
                },
              },
            },
          },
          '403': {
            description: 'Not authenticated for this action.',
          },
          '404': {
            description: 'User is not found.',
          },
        },
      },
      delete: {
        tags: ['users'],
        security: [
          {
            Authorization: [],
          },
        ],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'string',
              minimum: 0,
            },
          },
        ],
        description: 'Deletes a single users from the system',
        responses: {
          '200': {
            description: 'Deleted user object.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  $ref: '#/components/schemas/User',
                },
              },
            },
          },
          '403': {
            description: 'Authentication token is not valid.',
          },
          '404': {
            description: 'User is not found.',
          },
        },
      },
    },
    '/users/search': {
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
            name: 'email',
            schema: {
              type: 'string',
              minimum: 0,
            },
          },
          {
            in: 'query',
            name: 'name',
            schema: {
              type: 'string',
              minimum: 0,
            },
          },
          {
            in: 'query',
            name: 'phone',
            schema: {
              type: 'string',
              minimum: 0,
            },
          },
          {
            in: 'query',
            name: 'discord',
            schema: {
              type: 'string',
              minimum: 0,
            },
          },
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
          {
            in: 'query',
            name: 'enabled',
            schema: {
              type: 'boolean',
            },
          },
          {
            in: 'query',
            name: 'leadId',
            schema: {
              type: 'string',
              minimum: 0,
            },
          },
          {
            in: 'query',
            name: 'authority',
            schema: {
              type: 'string',
              minimum: 0,
            },
          },
          {
            in: 'query',
            name: 'tShirtSize',
            schema: {
              type: 'string',
              minimum: 0,
            },
          },
          {
            in: 'query',
            name: 'alcohol',
            schema: {
              type: 'string',
              minimum: 0,
            },
          },
        ],
        description: 'Returns a list of searched users from the system',
        responses: {
          '200': {
            description: 'List with searched users.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  $ref: '#/components/schemas/User',
                },
              },
            },
          },
          '403': {
            description: 'Authentication token is not valid.',
          },
        },
      },
    },
    '/sessions': {
      get: {
        tags: ['sessions'],
        security: [
          {
            Authorization: [],
          },
        ],

        description: 'Returns all sessions from the system that the user has access to',
        responses: {
          '200': {
            description: 'A list of sessions.',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  $ref: '#/components/schemas/Session',
                },
              },
            },
          },
          '403': {
            description: 'Authentication token is not valid.',
          },
        },
      },
      post: {
        tags: ['sessions'],
        description: 'Creates new session',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SessionInput',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Session created.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  $ref: '#/components/schemas/Session',
                },
              },
            },
          },
        },
      },
    },
    '/leads': {
      get: {
        tags: ['leads'],
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
        description: 'Returns all leads from the system that the user has access to',
        responses: {
          '200': {
            description: 'A list of leads.',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  $ref: '#/components/schemas/Lead',
                },
              },
            },
          },
          '403': {
            description: 'Authentication token is not valid.',
          },
        },
      },
    },
    '/leads/{userId}': {
      post: {
        tags: ['leads'],
        security: [
          {
            Authorization: [],
          },
        ],
        description: 'Creates new lead',

        parameters: [
          {
            in: 'path',
            name: 'userId',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Lead created.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  $ref: '#/components/schemas/Lead',
                },
              },
            },
          },
          '403': {
            description: 'Authentication token is not valid.',
          },
          '409': {
            description: 'Lead already exist.',
          },
        },
      },
    },
    '/leads/{id}': {
      get: {
        tags: ['leads'],
        security: [
          {
            Authorization: [],
          },
        ],
        parameters: [
          {
            in: 'path',
            name: 'id',
            schema: {
              type: 'string',
              required: true,
              format: 'uuid',
            },
          },
        ],
        description: 'Returns a single lead from the system',
        responses: {
          '200': {
            description: 'Lead object.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  $ref: '#/components/schemas/Lead',
                },
              },
            },
          },
          '403': {
            description: 'Authentication token is not valid.',
          },
          '404': {
            description: 'Lead is not found.',
          },
        },
      },
      delete: {
        tags: ['leads'],
        security: [
          {
            Authorization: [],
          },
        ],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'string',
              minimum: 0,
            },
          },
        ],
        description: 'Deletes a single lead from the system',
        responses: {
          '200': {
            description: 'Deleted lead object.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  $ref: '#/components/schemas/Lead',
                },
              },
            },
          },
          '403': {
            description: 'Authentication token is not valid.',
          },
          '404': {
            description: 'Lead is not found.',
          },
        },
      },
    },
    '/celebrations': {
      get: {
        tags: ['celebrations'],
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
        description: 'Returns all celebrations from the system that the user has access to',
        responses: {
          '200': {
            description: 'A list of celebrations.',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  $ref: '#/components/schemas/Celebration',
                },
              },
            },
          },
          '403': {
            description: 'Authentication token is not valid.',
          },
        },
      },
    },
    '/celebrations/{id}': {
      get: {
        tags: ['celebrations'],
        security: [
          {
            Authorization: [],
          },
        ],
        parameters: [
          {
            in: 'path',
            name: 'id',
            schema: {
              type: 'string',
              required: true,
              format: 'uuid',
            },
          },
        ],
        description: 'Returns a single celebration from the system',
        responses: {
          '200': {
            description: 'Celebration object.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  $ref: '#/components/schemas/Celebration',
                },
              },
            },
          },
          '403': {
            description: 'Authentication token is not valid.',
          },
          '404': {
            description: 'Celebration is not found.',
          },
        },
      },
      patch: {
        tags: ['celebrations'],
        description: 'Update celebration',
        security: [
          {
            Authorization: [],
          },
        ],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CelebrationInput',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Celebration updated.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  $ref: '#/components/schemas/Celebration',
                },
              },
            },
          },
          '403': {
            description: 'Not authenticated for this action.',
          },
          '404': {
            description: 'Celebration is not found.',
          },
        },
      },
      delete: {
        tags: ['celebrations'],
        security: [
          {
            Authorization: [],
          },
        ],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'string',
              minimum: 0,
            },
          },
        ],
        description: 'Deletes a single celebration from the system',
        responses: {
          '200': {
            description: 'Deleted celebration object.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  $ref: '#/components/schemas/Celebration',
                },
              },
            },
          },
          '403': {
            description: 'Authentication token is not valid.',
          },
          '404': {
            description: 'Celebration is not found.',
          },
        },
      },
    },
    '/celebrations/{userId}': {
      post: {
        tags: ['celebrations'],
        security: [
          {
            Authorization: [],
          },
        ],
        parameters: [
          {
            in: 'path',
            name: 'userId',
            schema: {
              type: 'string',
              required: true,
              format: 'uuid',
            },
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CelebrationInput',
              },
            },
          },
        },
        description: 'Creates a celebration and connects it with user id.',
        responses: {
          '200': {
            description: 'Celebration created.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  $ref: '#/components/schemas/Celebration',
                },
              },
            },
          },
          '403': {
            description: 'Authentication token is not valid.',
          },
          '409': {
            description: 'Conflict.',
          },
        },
      },
    },
    '/timeoffs': {
      get: {
        tags: ['timeoffs'],
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
        description: 'Returns all timeoffs from the system that the user has access to',
        responses: {
          '200': {
            description: 'A list of timeoffs.',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  $ref: '#/components/schemas/TimeOff',
                },
              },
            },
          },
          '403': {
            description: 'Authentication token is not valid.',
          },
        },
      },
    },
    '/timeoffs/{userId}': {
      post: {
        tags: ['timeoffs'],
        security: [
          {
            Authorization: [],
          },
        ],
        parameters: [
          {
            in: 'path',
            name: 'userId',
            schema: {
              type: 'string',
              required: true,
              format: 'uuid',
            },
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/TimeOffInput',
              },
            },
          },
        },
        description: 'Creates a timeoff and connects it with user id.',
        responses: {
          '200': {
            description: 'Time off created.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  $ref: '#/components/schemas/TimeOff',
                },
              },
            },
          },
          '403': {
            description: 'Authentication token is not valid.',
          },
          '409': {
            description: 'Conflict.',
          },
        },
      },
    },
    '/timeoffs/{id}': {
      get: {
        tags: ['timeoffs'],
        security: [
          {
            Authorization: [],
          },
        ],
        parameters: [
          {
            in: 'path',
            name: 'id',
            schema: {
              type: 'string',
              required: true,
              format: 'uuid',
            },
          },
        ],
        description: 'Returns a single timeoff from the system',
        responses: {
          '200': {
            description: 'Time off object.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  $ref: '#/components/schemas/TimeOff',
                },
              },
            },
          },
          '403': {
            description: 'Authentication token is not valid.',
          },
          '404': {
            description: 'Time off is not found.',
          },
        },
      },
      patch: {
        tags: ['timeoffs'],
        description: 'Update time off',
        security: [
          {
            Authorization: [],
          },
        ],
        parameters: [
          {
            in: 'path',
            name: 'id',
            schema: {
              required: true,
              type: 'string',
              format: 'uuid',
            },
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/TimeOffInput',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Time off updated.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  $ref: '#/components/schemas/TimeOff',
                },
              },
            },
          },
          '403': {
            description: 'Not authenticated for this action.',
          },
          '404': {
            description: 'Time off is not found.',
          },
        },
      },
      delete: {
        tags: ['timeoffs'],
        security: [
          {
            Authorization: [],
          },
        ],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'string',
              minimum: 0,
            },
          },
        ],
        description: 'Deletes a single time off from the system',
        responses: {
          '200': {
            description: 'Deleted time off object.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  $ref: '#/components/schemas/TimeOff',
                },
              },
            },
          },
          '403': {
            description: 'Authentication token is not valid.',
          },
          '404': {
            description: 'TimeOff is not found.',
          },
        },
      },
    },
  },
}
