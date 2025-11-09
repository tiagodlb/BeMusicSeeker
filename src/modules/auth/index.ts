import Elysia, { status } from "elysia";
import { AuthService } from "./service";
import { AuthModel } from "./model";
import { auth_guard } from "../../core/security/auth_guards";

export const authController = new Elysia({ prefix: "/auth" })
  .use(auth_guard)
  .post(
    "/register",
    async ({ body }) => {
      const newUser = await AuthService.register(body);
      return {
        message:
          "Usuário registrado com sucesso! Aguardando aprovação do administrador.",
        data: newUser,
      };
    },
    {
      body: AuthModel.registerUserBody,
      detail: {
        tags: ["Autenticação"],
         summary: "Create new user account",
        description:
          "Register a new user in the system with email and password",
        responses: {
          //TODO: Colocar as respostas aqui
        },
      },
    }
  )
  .post(
    "/signin",
    async ({ jwt, body }) => {
      try {
        const result = await AuthService.signIn(jwt, body);
        return {
          success: true,
          result,
        };
      } catch (error) {
        throw {
          success: false,
          message: error,
        };
      }
    },
    {
      body: AuthModel.loginUserBody,
      detail: {
        tags: ["Autenticação"],
        summary: "User login",
        description:
          "Authenticate user with email and password to receive JWT token",
        responses: {
          200: {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                    },
                    token: {
                      type: "string",
                      description: "JWT Autenticação token",
                    },
                    user: {
                      type: "object",
                      properties: {
                        email: { type: "string" },
                        role: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
          422: {
            description: "Unprocessed Entity",
          },
          401: {
            description: "Invalid credentials",
          },
          404: {
            description: "User not found",
          },
        },
      },
    }
  )
  .get(
    "/validate",
    async ({ jwt, headers: { authorization } }) => {
      try {
        const token = authorization?.replace("Bearer ", "");

        if (!token) {
          throw status(401);
        }
        const isValid = await AuthService.validateSession(
          authorization as string,
          jwt
        );

        if (!isValid) {
          throw status(401, "Unauthorized - Invalid or missing token");
        }

        const user = await AuthService.profile(isValid);

        return {
          valid: isValid ? true : false,
          user: {
            email: user?.email,
            role: user?.role,
          },
        };
      } catch (error) {
        console.error(error);

        if (error instanceof Error && "status" in error) {
          throw error;
        }

        return status(401, "Invalid Token");
      }
    },
    {
      detail: {
        tags: ["Autenticação"],
        summary: "Validate JWT token",
        description: "Check if the provided JWT token is valid and not expired",
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: "Token validation result",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    valid: {
                      type: "boolean",
                      description: "Whether the token is valid",
                    },
                    user: {
                      type: "object",
                      nullable: true,
                      properties: {
                        email: { type: "string" },
                        role: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Unauthorized - Invalid or missing token",
          },
        },
      },
    }
  )
  .post(
    "/logout",
    async ({ headers: { authorization } }) => {
      try {
        const token = authorization?.replace("Bearer ", "");

        if (!token) {
          return status(401, "No token provided");
        }

        const result = await AuthService.logout(token);

        return {
          success: true,
          result: result,
        };
      } catch (error) {
        console.error("Logout error", error);

        if (error instanceof Error && "status" in error) {
          throw error;
        }

        return status(500, "Logout failed");
      }
    },
    {
      detail: {
        tags: ["Autenticação"],
        summary: "User logout",
        description: "Logout the current user and invalidate the session",
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: "Logout successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    message: { type: "string" },
                  },
                },
              },
            },
          },
          401: {
            description: "No token provided",
          },
        },
      },
    }
  )
  .post(
    "/refresh",
    async ({ jwt, headers: { authorization } }) => {
      try {
        const token = authorization?.replace("Bearer ", "");

        if (!token) {
          return status(401, "No token provided");
        }

        const result = await AuthService.refreshToken(token, jwt);

        return result;
      } catch (error) {
        console.error("Refresh token error:", error);

        if (error instanceof Error && "status" in error) {
          throw error;
        }

        return status(401, "Token refresh failed");
      }
    },
    {
      detail: {
        tags: ["Autenticação"],
        summary: "Refresh JWT token",
        description:
          "Exchange a valid token for a new one with extended expiration",
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: "Token refreshed successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    token: {
                      type: "string",
                      description: "New JWT token (JWE encrypted)",
                    },
                    expiresIn: {
                      type: "string",
                      description: "New token expiration time",
                      example: "7d",
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Invalid or expired token",
            content: {
              "application/json": {
                schema: {
                  type: "string",
                  enum: [
                    "No token provided",
                    "Token has been revoked",
                    "Invalid token",
                    "User not found",
                    "Token refresh failed",
                  ],
                },
              },
            },
          },
        },
      },
    }
  );
