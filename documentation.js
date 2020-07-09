export default {
  swagger: '2.0',
  info: {
    description:
      'API integrada ao MongoDB cujo o schema dos dados será definido pelo mongoose. Esta API terá alguns endpoints para manipulação dos dados utilizando estruturação e persistência dos dados pelo mongoose.',
    version: '1.0.0',
    title: 'My Bank API documentation',
  },
  host: 'localhost:3001',
  tags: [
    {
      name: 'account',
      description: 'Operations about account',
    },
  ],
  schemes: ['https', 'http'],
  paths: {
    '/account': {
      get: {
        tags: ['account'],
        summary: 'Get existing accounts',
        description: 'Get existing accounts',
        produces: ['application/json'],
        responses: {
          '200': {
            description: 'Successful operation',
            schema: {
              type: 'array',
              items: {
                $ref: '#/definitions/Account',
              },
            },
          },
          '400': {
            description: 'Error occurred',
          },
        },
      },
    },
    '/account/balance/{agency}/{account}': {
      get: {
        tags: ['account'],
        summary: 'Get balance in account',
        description:
          "This endpoint must receive as a parameter the 'branch' and the number of the 'account', and must return its 'balance'. If the informed account does not exist, return an error.",
        produces: ['application/json'],
        parameters: [
          {
            name: 'agency',
            in: 'path',
            description: 'Agency number that need to be considered for filter',
            required: true,
            type: 'integer',
            format: 'int64',
          },
          {
            name: 'account',
            in: 'path',
            description: 'Account number that need to be considered for filter',
            required: true,
            type: 'integer',
            format: 'int64',
          },
        ],
        responses: {
          '200': {
            description: 'Successful operation',
            schema: {
              type: 'array',
              items: {
                $ref: '#/definitions/Account',
              },
            },
          },
          '400': {
            description: 'Error occurred',
          },
        },
      },
    },
    '/account/average/{agency}': {
      get: {
        tags: ['account'],
        summary: 'Get average balance agency',
        description:
          "This endpoint to consult the average balance of accounts of a specific agency. The endpoint should receive the 'agency' as a parameter and should return the average balance of the account.",
        produces: ['application/json'],
        parameters: [
          {
            name: 'agency',
            in: 'path',
            description: 'Agency number that need to be considered for filter',
            required: true,
            type: 'integer',
            format: 'int64',
          },
        ],
        responses: {
          '200': {
            description: 'Successful operation',
            schema: {
              type: 'array',
              items: {
                $ref: '#/definitions/Account',
              },
            },
          },
          '400': {
            description: 'Error occurred',
          },
        },
      },
    },
    '/account/lowest-balance/{limit}': {
      get: {
        tags: ['account'],
        summary: 'Get accounts with the lowest account balance',
        description:
          'The endpoint should receive a numerical value as a parameter to determine the number of accounts to be listed, and the endpoint should return the list of clients (branch, account, balance) in ascending order.',
        produces: ['application/json'],
        parameters: [
          {
            name: 'limit',
            in: 'path',
            description: 'Limit numbers of accounts returned',
            required: true,
            type: 'integer',
            format: 'int64',
          },
        ],
        responses: {
          '200': {
            description: 'Successful operation',
            schema: {
              type: 'array',
              items: {
                $ref: '#/definitions/Account',
              },
            },
          },
          '400': {
            description: 'Error occurred',
          },
        },
      },
    },
    '/account/highest-balance/{limit}': {
      get: {
        tags: ['account'],
        summary: 'Get accounts with the highest account balance',
        description:
          'The endpoint should receive a numerical value as a parameter to determine the number of accounts to be listed, and the endpoint should return the list of clients (branch, account, name, balance) in descending order.',
        produces: ['application/json'],
        parameters: [
          {
            name: 'limit',
            in: 'path',
            description: 'Limit numbers of accounts returned',
            required: true,
            type: 'integer',
            format: 'int64',
          },
        ],
        responses: {
          '200': {
            description: 'Successful operation',
            schema: {
              type: 'array',
              items: {
                $ref: '#/definitions/Account',
              },
            },
          },
          '400': {
            description: 'Error occurred',
          },
        },
      },
    },
    '/account/deposit/{agency}/{account}': {
      patch: {
        tags: ['account'],
        summary: 'Do deposit in account',
        description:
          "This endpoint can receive as parameters of an 'agency', the number of 'account' and the amount of the deposit. He must update the 'balance' of the account, increasing it with the amount received as a parameter. The terminal can validate if information is available, if not there is a return error, if there is a return or current account balance.",
        produces: ['application/json'],
        parameters: [
          {
            name: 'agency',
            in: 'path',
            description: 'Agency number that need to be considered for filter',
            required: true,
            type: 'integer',
            format: 'int64',
          },
          {
            name: 'account',
            in: 'path',
            description: 'Account number that need to be considered for filter',
            required: true,
            type: 'integer',
            format: 'int64',
          },
          {
            name: 'value',
            in: 'body',
            description: 'Value for withdraw',
            required: true,
            schema: {
              $ref: '#/definitions/Account',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Successful operation',
            schema: {
              type: 'array',
              items: {
                $ref: '#/definitions/Account',
              },
            },
          },
          '400': {
            description: 'Error occurred',
          },
        },
      },
    },
    '/account/withdraw/{agency}/{account}': {
      patch: {
        tags: ['account'],
        summary: 'Do withdraw in account',
        description:
          "This endpoint must receive as parameters the 'agency', the 'account' number and the withdrawal amount. He must update the balance of the account, decreasing it with the amount received with a parameter and charging a withdrawal fee of (1). The endpoint should validate if the informed account exists, if it does not exist an error must be returned, if there is a return of the current account balance. You must also validate that the account has sufficient balance for that withdrawal, if it does not have to return an error, thus not allowing the withdrawal to be negative.",
        produces: ['application/json'],
        parameters: [
          {
            name: 'agency',
            in: 'path',
            description: 'Agency number that need to be considered for filter',
            required: true,
            type: 'integer',
            format: 'int64',
          },
          {
            name: 'account',
            in: 'path',
            description: 'Account number that need to be considered for filter',
            required: true,
            type: 'integer',
            format: 'int64',
          },
          {
            name: 'value',
            in: 'body',
            description: 'Value for withdraw',
            required: true,
            schema: {
              $ref: '#/definitions/Account',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Successful operation',
            schema: {
              type: 'array',
              items: {
                $ref: '#/definitions/Account',
              },
            },
          },
          '400': {
            description: 'Error occurred',
          },
        },
      },
    },
    '/account/transfer/{origin}/{destiny}': {
      patch: {
        tags: ['account'],
        summary: 'Do tranfer between accounts',
        description:
          "This endpoint should receive the source 'account' number, the destination 'account' number and the transfer amount as a parameter. This endpoint must validate whether the accounts are from the same agency to carry out the transfer, if it is from different agencies, the transfer fee (8) must be charged to the original 'account'. The endpoint should return the balance of the source account.",
        produces: ['application/json'],
        parameters: [
          {
            name: 'origin',
            in: 'path',
            description: 'Agency number that need to be considered for filter',
            required: true,
            type: 'integer',
            format: 'int64',
          },
          {
            name: 'destiny',
            in: 'path',
            description: 'Account number that need to be considered for filter',
            required: true,
            type: 'integer',
            format: 'int64',
          },
          {
            name: 'value',
            in: 'body',
            description: 'Value for transfer',
            required: true,
            schema: {
              $ref: '#/definitions/Account',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Successful operation',
            schema: {
              type: 'array',
              items: {
                $ref: '#/definitions/Account',
              },
            },
          },
          '400': {
            description: 'Error occurred',
          },
        },
      },
    },
    '/account/private': {
      patch: {
        tags: ['account'],
        summary: 'Do tranfer agency accounts',
        description:
          'This endpoint that will transfer the client with the highest account balance from each agency to the private agency agency = 99. The endpoint should return the list of clients from the private agency.',
        produces: ['application/json'],
        responses: {
          '200': {
            description: 'Successful operation',
            schema: {
              type: 'array',
              items: {
                $ref: '#/definitions/Account',
              },
            },
          },
          '400': {
            description: 'Error occurred',
          },
        },
      },
    },
    '/account/{agency}/{account}': {
      delete: {
        tags: ['account'],
        summary: 'Delete account',
        description:
          "This endpoint should receive as a parameter the 'agency' and the account 'account number' and return the number of active accounts for this agency.",
        produces: ['application/json'],
        parameters: [
          {
            name: 'agency',
            in: 'path',
            description: 'Agency number that need to be considered for filter',
            required: true,
            type: 'integer',
            format: 'int64',
          },
          {
            name: 'account',
            in: 'path',
            description: 'Account number that need to be considered for filter',
            required: true,
            type: 'integer',
            format: 'int64',
          },
        ],
        responses: {
          '200': {
            description: 'Successful operation',
            schema: {
              type: 'array',
              items: {
                $ref: '#/definitions/Account',
              },
            },
          },
          '400': {
            description: 'Error occurred',
          },
        },
      },
    },
  },
  definitions: {
    Account: {
      type: 'object',
      properties: {
        agency: {
          type: 'integer',
          format: 'int64',
          example: 10,
        },
        account: {
          type: 'integer',
          format: 'int64',
          example: 1001,
        },
        name: {
          type: 'string',
          example: 'Maria Roberta Fernandes',
        },
        balance: {
          type: 'integer',
          example: 587,
        },
      },
    },
    ApiResponse: {
      type: 'object',
      properties: {
        code: {
          type: 'integer',
          format: 'int32',
        },
        type: {
          type: 'string',
        },
        message: {
          type: 'string',
        },
      },
    },
  },
  externalDocs: {
    description: 'Find out more about Swagger',
    url: 'http://swagger.io',
  },
};
