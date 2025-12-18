import { Elysia, t } from "elysia";
import { FavoriteService } from "./service";
import { betterAuth } from "../../core/auth/macro";
import { UserRepository } from "../perfil/repository";

const favoriteService = new FavoriteService();

export const favoriteRoutes = new Elysia({ prefix: "/favorites" })
  .use(betterAuth)
  .get(
    "/",
    async (ctx) => {
      const user = ctx.user as { email: string } | undefined;
      if (!user?.email) return ctx.status(401, { success: false, error: "Nao autenticado" });

      const dbUser = await UserRepository.findByEmail(user.email);
      if (!dbUser) return ctx.status(401, { success: false, error: "Usuario nao encontrado" });

      const limit = ctx.query.limit ?? 20;
      const offset = ctx.query.offset ?? 0;

      const result = await favoriteService.getFavorites(dbUser.id, limit, offset);
      return { success: true, data: result };
    },
    {
      query: t.Object({
        limit: t.Optional(t.Numeric({ default: 20 })),
        offset: t.Optional(t.Numeric({ default: 0 })),
      }),
      auth: true,
      detail: { tags: ["Favorites"], summary: "Listar musicas favoritas do usuario" },
    }
  )
  .post(
    "/check",
    async (ctx) => {
      const user = ctx.user as { email: string } | undefined;
      if (!user?.email) return ctx.status(401, { success: false, error: "Nao autenticado" });

      const dbUser = await UserRepository.findByEmail(user.email);
      if (!dbUser) return ctx.status(401, { success: false, error: "Usuario nao encontrado" });

      const savedIds = await favoriteService.checkFavorites(dbUser.id, ctx.body.songIds);
      return { success: true, data: { savedIds } };
    },
    {
      body: t.Object({
        songIds: t.Array(t.Number()),
      }),
      auth: true,
      detail: { tags: ["Favorites"], summary: "Verificar quais musicas estao nos favoritos" },
    }
  )
  .post(
    "/:songId",
    async (ctx) => {
      const user = ctx.user as { email: string } | undefined;
      if (!user?.email) return ctx.status(401, { success: false, error: "Nao autenticado" });

      const dbUser = await UserRepository.findByEmail(user.email);
      if (!dbUser) return ctx.status(401, { success: false, error: "Usuario nao encontrado" });

      const songId = Number(ctx.params.songId);
      const result = await favoriteService.toggleFavorite(dbUser.id, songId);

      return { success: true, data: result };
    },
    {
      params: t.Object({ songId: t.String() }),
      auth: true,
      detail: { tags: ["Favorites"], summary: "Adicionar/remover musica dos favoritos (toggle)" },
    }
  )
  .get(
    "/:songId",
    async (ctx) => {
      const user = ctx.user as { email: string } | undefined;
      if (!user?.email) return ctx.status(401, { success: false, error: "Nao autenticado" });

      const dbUser = await UserRepository.findByEmail(user.email);
      if (!dbUser) return ctx.status(401, { success: false, error: "Usuario nao encontrado" });

      const songId = Number(ctx.params.songId);
      const isFavorite = await favoriteService.isFavorite(dbUser.id, songId);

      return { success: true, data: { isFavorite } };
    },
    {
      params: t.Object({ songId: t.String() }),
      auth: true,
      detail: { tags: ["Favorites"], summary: "Verificar se musica esta nos favoritos" },
    }
  );