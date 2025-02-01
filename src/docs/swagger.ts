
const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Birthday API",
    version: "1.0.0",
    description: "API to send birthday greetings to users",
    contact: {
      name: "Nasution",
      email: "nasutioncode@gmail.com",
      url: "https://github.com/nascript",
    },
  },
  servers: [
    {
      url: "http://localhost:3000/api",
      description: "Local server",
    },
  ],
  paths: {
    "/user": {
      post: {
        summary: "Create a new user",
        description: "Adds a new user to the system",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  firstName: { type: "string" },
                  lastName: { type: "string" },
                  birthday: { type: "string", format: "date-time" },
                  timezone: { type: "string" },
                  email: { type: "string", format: "email" },
                },
                required: [
                  "firstName",
                  "lastName",
                  "birthday",
                  "timezone",
                  "email",
                ],
              },
            },
          },
        },
        responses: {
          201: {
            description: "User created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string" },
                    data: {
                      type: "object",
                      properties: {
                        id: { type: "integer" },
                        firstName: { type: "string" },
                        lastName: { type: "string" },
                        birthday: { type: "string", format: "date-time" },
                        timezone: { type: "string" },
                        email: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Invalid request data",
          },
        },
      },
    },

    "/user/{id}": {
      get: {
        summary: "Get user by ID",
        description: "Retrieves user details by their ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: {
            description: "User retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string" },
                    data: {
                      type: "object",
                      properties: {
                        id: { type: "integer" },
                        firstName: { type: "string" },
                        lastName: { type: "string" },
                        birthday: { type: "string", format: "date-time" },
                        timezone: { type: "string" },
                        email: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "User not found",
          },
        },
      },

      put: {
        summary: "Update user",
        description: "Updates user information by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  firstName: { type: "string" },
                  lastName: { type: "string" },
                  birthday: { type: "string", format: "date-time" },
                  timezone: { type: "string" },
                  email: { type: "string", format: "email" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "User updated successfully",
          },
          404: {
            description: "User not found",
          },
        },
      },

      delete: {
        summary: "Delete a user",
        description: "Deletes a user by their ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: {
            description: "User deleted successfully",
          },
          404: {
            description: "User not found",
          },
        },
      },
    },

    "/users": {
      get: {
        summary: "List all users",
        description: "Retrieves a paginated list of users",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer" } },
          { name: "perPage", in: "query", schema: { type: "integer" } },
          { name: "search", in: "query", schema: { type: "string" } },
          {
            name: "sortBy",
            in: "query",
            schema: {
              type: "string",
              enum: ["createdAt", "firstName", "lastName"],
            },
          },
          {
            name: "sortOrder",
            in: "query",
            schema: { type: "string", enum: ["asc", "desc"] },
          },
        ],
        responses: {
          200: {
            description: "Users retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string" },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "integer" },
                          firstName: { type: "string" },
                          lastName: { type: "string" },
                          birthday: { type: "string", format: "date-time" },
                          timezone: { type: "string" },
                          email: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export default swaggerDocument;

