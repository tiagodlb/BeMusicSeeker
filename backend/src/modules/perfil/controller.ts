import { Elysia } from "elysia";
import { UserService } from "./service";
import { UserModel } from "./model";
import { betterAuth } from "../../core/auth/macro";

export const userRoutes = new Elysia({
  prefix: "/users",
  detail: {
    tags: ["Users"],
  },
})
  .use(betterAuth)
  .get(
    "/",
    async ({ query, status }) => {
      const limit = Math.min(query.limit ? parseInt(query.limit) : 20, 100);
      const offset = query.offset ? parseInt(query.offset) : 0;
      const search = query.search || undefined;
      const isArtist =
        query.is_artist !== undefined
          ? query.is_artist === "true"
          : undefined;

      const result = await UserService.list({
        limit,
        offset,
        search,
        isArtist,
      });

      if (result.error) {
        return status(500, { success: false, error: result.error.message });
      }

      return {
        success: true,
        data: result.data.users,
        pagination: {
          total: result.data.total,
          limit,
          offset,
        },
      };
    },
    {
      query: UserModel.listQuery,
      detail: {
        summary: "Listar usuarios",
        description: "Lista todos os usuarios com paginacao e filtros",
      },
    }
  )

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
        summary: "Buscar usuario por ID",
        description: "Retorna os dados publicos de um usuario",
      },
    }
  )

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

  .put(
    "/:id",
    async ({ params, body, user, status }) => {
      if (!user?.id) {
        return status(401, { success: false, error: "Nao autenticado" });
      }

      const id = parseInt(params.id);
      const result = await UserService.update(id, body, parseInt(user.id));

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

  .delete(
    "/:id",
    async ({ params, user, status }) => {
      if (!user?.id) {
        return status(401, { success: false, error: "Nao autenticado" });
      }

      const id = parseInt(params.id);
      const result = await UserService.delete(id, parseInt(user.id));

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
  )

  .get(
    "/me",
    async ({ user, status }) => {
      if (!user?.id) {
        return status(401, { success: false, error: "Nao autenticado" });
      }

      const result = await UserService.getById(parseInt(user.id));

      if (result.error) {
        return status(404, { success: false, error: result.error.message });
      }

      return {
        success: true,
        data: result.data,
      };
    },
    {
      auth: true,
      detail: {
        summary: "Usuario atual",
        description: "Retorna os dados do usuario autenticado",
      },
    }
  );