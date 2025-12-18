import { Elysia, t } from "elysia";
import { FollowService } from "./service";
import { betterAuth } from "../../core/auth/macro";
import { UserRepository } from "../perfil/repository";

const followService = new FollowService();

export const followRoutes = new Elysia({ prefix: "/follows" })
  .use(betterAuth)
  .get(
    "/following",
    async (ctx) => {
      const user = ctx.user as { email: string } | undefined;
      if (!user?.email) return ctx.status(401, { success: false, error: "Nao autenticado" });

      const dbUser = await UserRepository.findByEmail(user.email);
      if (!dbUser) return ctx.status(401, { success: false, error: "Usuario nao encontrado" });

      const limit = ctx.query.limit ?? 20;
      const offset = ctx.query.offset ?? 0;

      const result = await followService.getFollowing(dbUser.id, limit, offset);
      return { success: true, data: result };
    },
    {
      query: t.Object({
        limit: t.Optional(t.Numeric({ default: 20 })),
        offset: t.Optional(t.Numeric({ default: 0 })),
      }),
      auth: true,
      detail: { tags: ["Follows"], summary: "Listar usuarios que voce segue" },
    }
  )
  .get(
    "/followers",
    async (ctx) => {
      const user = ctx.user as { email: string } | undefined;
      if (!user?.email) return ctx.status(401, { success: false, error: "Nao autenticado" });

      const dbUser = await UserRepository.findByEmail(user.email);
      if (!dbUser) return ctx.status(401, { success: false, error: "Usuario nao encontrado" });

      const limit = ctx.query.limit ?? 20;
      const offset = ctx.query.offset ?? 0;

      const result = await followService.getFollowers(dbUser.id, limit, offset);
      return { success: true, data: result };
    },
    {
      query: t.Object({
        limit: t.Optional(t.Numeric({ default: 20 })),
        offset: t.Optional(t.Numeric({ default: 0 })),
      }),
      auth: true,
      detail: { tags: ["Follows"], summary: "Listar seus seguidores" },
    }
  )
  .get(
    "/user/:userId/following",
    async ({ params, query }) => {
      const userId = Number(params.userId);
      const limit = query.limit ?? 20;
      const offset = query.offset ?? 0;

      const result = await followService.getFollowing(userId, limit, offset);
      return { success: true, data: result };
    },
    {
      params: t.Object({ userId: t.String() }),
      query: t.Object({
        limit: t.Optional(t.Numeric({ default: 20 })),
        offset: t.Optional(t.Numeric({ default: 0 })),
      }),
      detail: { tags: ["Follows"], summary: "Listar usuarios que alguem segue" },
    }
  )
  .get(
    "/user/:userId/followers",
    async ({ params, query }) => {
      const userId = Number(params.userId);
      const limit = query.limit ?? 20;
      const offset = query.offset ?? 0;

      const result = await followService.getFollowers(userId, limit, offset);
      return { success: true, data: result };
    },
    {
      params: t.Object({ userId: t.String() }),
      query: t.Object({
        limit: t.Optional(t.Numeric({ default: 20 })),
        offset: t.Optional(t.Numeric({ default: 0 })),
      }),
      detail: { tags: ["Follows"], summary: "Listar seguidores de alguem" },
    }
  )
  .get(
    "/user/:userId/stats",
    async ({ params }) => {
      const userId = Number(params.userId);
      const stats = await followService.getStats(userId);
      return { success: true, data: stats };
    },
    {
      params: t.Object({ userId: t.String() }),
      detail: { tags: ["Follows"], summary: "Estatisticas de follows de um usuario" },
    }
  )
  .post(
    "/:userId",
    async (ctx) => {
      const user = ctx.user as { email: string } | undefined;
      if (!user?.email) return ctx.status(401, { success: false, error: "Nao autenticado" });

      const dbUser = await UserRepository.findByEmail(user.email);
      if (!dbUser) return ctx.status(401, { success: false, error: "Usuario nao encontrado" });

      const targetId = Number(ctx.params.userId);

      try {
        const result = await followService.toggleFollow(dbUser.id, targetId);
        return { success: true, data: result };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Erro ao seguir/deixar de seguir";
        return ctx.status(400, { success: false, error: message });
      }
    },
    {
      params: t.Object({ userId: t.String() }),
      auth: true,
      detail: { tags: ["Follows"], summary: "Seguir/deixar de seguir usuario (toggle)" },
    }
  )
  .get(
    "/:userId/status",
    async (ctx) => {
      const user = ctx.user as { email: string } | undefined;
      if (!user?.email) return ctx.status(401, { success: false, error: "Nao autenticado" });

      const dbUser = await UserRepository.findByEmail(user.email);
      if (!dbUser) return ctx.status(401, { success: false, error: "Usuario nao encontrado" });

      const targetId = Number(ctx.params.userId);
      const isFollowing = await followService.isFollowing(dbUser.id, targetId);

      return { success: true, data: { isFollowing } };
    },
    {
      params: t.Object({ userId: t.String() }),
      auth: true,
      detail: { tags: ["Follows"], summary: "Verificar se esta seguindo usuario" },
    }
  );