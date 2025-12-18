import Elysia from "elysia";
import { betterAuth } from "../../core/auth/macro";
import { UserModel } from "./model";
import { UserService } from "./service";
import { UserRepository } from "./repository";

export const userRoutes = new Elysia({ prefix: "/users" })
  .use(betterAuth)
  // ==========================================
  // GET /me - Usuário atual (por email do auth)
  // ==========================================
  .get(
    "/me",
    async ({ user, status }) => {
      if (!user?.id || !user?.email) {
        return status(401, { success: false, error: "Nao autenticado" });
      }

      // Buscar pelo EMAIL, não pelo ID (better-auth usa UUID, nossa tabela usa integer)
      let dbUser = await UserRepository.findByEmail(user.email);

      // Se não existir na tabela users, criar automaticamente (sync com better-auth)
      if (!dbUser) {
        const userName = user.name || user.email.split("@")[0] || "Usuario";
        const createResult = await UserRepository.create({
          email: user.email,
          name: userName,
          password_hash: "", // não usado, auth é pelo better-auth
        });

        if (!createResult) {
          return status(500, { success: false, error: "Erro ao sincronizar usuario" });
        }

        dbUser = createResult;
      }

      // Buscar stats
      const stats = await UserRepository.getStats(dbUser.id);

      return {
        success: true,
        data: {
          ...dbUser,
          stats: stats ?? {
            postsCount: 0,
            songsCount: 0,
            followersCount: 0,
            followingCount: 0,
          },
        },
      };
    },
    {
      auth: true,
      detail: {
        summary: "Usuario atual",
        description: "Retorna os dados do usuario autenticado",
      },
    }
  )

  // ==========================================
  // GET / - Listar usuários
  // ==========================================
  .get(
    "/",
    async ({ query }) => {
      const result = await UserService.list({
        limit: Number(query.limit) || 20,
        offset: Number(query.offset) || 0,
        search: query.search,
        isArtist: query.is_artist === "true" ? true : query.is_artist === "false" ? false : undefined,
      });

      if (result.error) {
        return {
          success: false,
          error: result.error.message,
        };
      }

      return {
        success: true,
        data: result.data!.users,
        pagination: {
          total: result.data!.total,
          limit: Number(query.limit) || 20,
          offset: Number(query.offset) || 0,
        },
      };
    },
    {
      query: UserModel.listQuery,
      detail: {
        summary: "Listar usuarios",
        description: "Lista usuarios com filtros e paginacao",
      },
    }
  )

  // ==========================================
  // GET /:id - Buscar por ID
  // ==========================================
  .get(
    "/:id",
    async ({ params, status }) => {
      const id = parseInt(params.id);
      const result = await UserService.getById(id);

      if (result.error) {
        const statusCode =
          result.error.code === "NOT_FOUND"
            ? 404
            : result.error.code === "INVALID_ID"
              ? 400
              : 500;

        return status(statusCode, {
          success: false,
          error: result.error.message,
        });
      }

      return {
        success: true,
        data: result.data,
      };
    },
    {
      params: UserModel.getByIdParams,
      detail: {
        summary: "Buscar usuario",
        description: "Retorna um usuario pelo ID",
      },
    }
  )

  // ==========================================
  // GET /:id/stats - Estatísticas do usuário
  // ==========================================
  .get(
    "/:id/stats",
    async ({ params, status }) => {
      const id = parseInt(params.id);
      const result = await UserService.getStats(id);

      if (result.error) {
        const statusCode =
          result.error.code === "NOT_FOUND"
            ? 404
            : result.error.code === "INVALID_ID"
              ? 400
              : 500;

        return status(statusCode, {
          success: false,
          error: result.error.message,
        });
      }

      return {
        success: true,
        data: result.data,
      };
    },
    {
      params: UserModel.getByIdParams,
      detail: {
        summary: "Estatisticas do usuario",
        description: "Retorna contadores de posts, musicas, seguidores e seguindo",
      },
    }
  )

  // ==========================================
  // PUT /:id - Atualizar perfil
  // ==========================================
  .put(
    "/:id",
    async ({ params, body, user, status }) => {
      if (!user?.email) {
        return status(401, { success: false, error: "Nao autenticado" });
      }

      // Buscar usuário atual pelo email
      const currentUser = await UserRepository.findByEmail(user.email);
      if (!currentUser) {
        return status(401, { success: false, error: "Usuario nao encontrado" });
      }

      const id = parseInt(params.id);
      const result = await UserService.update(id, body, currentUser.id);

      if (result.error) {
        const statusCode =
          result.error.code === "NOT_FOUND"
            ? 404
            : result.error.code === "INVALID_ID"
              ? 400
              : result.error.code === "UNAUTHORIZED"
                ? 403
                : 500;

        return status(statusCode, {
          success: false,
          error: result.error.message,
        });
      }

      return {
        success: true,
        data: result.data,
      };
    },
    {
      params: UserModel.getByIdParams,
      body: UserModel.updateBody,
      auth: true,
      detail: {
        summary: "Atualizar perfil",
        description: "Atualiza o perfil do usuario autenticado",
      },
    }
  )

  // ==========================================
  // DELETE /:id - Deletar conta
  // ==========================================
  .delete(
    "/:id",
    async ({ params, user, status }) => {
      if (!user?.email) {
        return status(401, { success: false, error: "Nao autenticado" });
      }

      // Buscar usuário atual pelo email
      const currentUser = await UserRepository.findByEmail(user.email);
      if (!currentUser) {
        return status(401, { success: false, error: "Usuario nao encontrado" });
      }

      const id = parseInt(params.id);
      const result = await UserService.delete(id, currentUser.id);

      if (result.error) {
        const statusCode =
          result.error.code === "NOT_FOUND"
            ? 404
            : result.error.code === "INVALID_ID"
              ? 400
              : result.error.code === "UNAUTHORIZED"
                ? 403
                : 500;

        return status(statusCode, {
          success: false,
          error: result.error.message,
        });
      }

      return {
        success: true,
        message: "Usuario deletado com sucesso",
      };
    },
    {
      params: UserModel.getByIdParams,
      auth: true,
      detail: {
        summary: "Deletar conta",
        description: "Deleta a conta do usuario autenticado",
      },
    }
  );