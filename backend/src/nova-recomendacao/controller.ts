import { Elysia, t } from "elysia";
import { RecommendationService } from "./service";
import { betterAuth } from "../core/auth/macro";
import { auth } from "../core/auth/auth";
import { UserRepository } from "../modules/perfil/repository";

const recommendationService = new RecommendationService();

export const recommendationRoutes = new Elysia({
  prefix: "/recommendations",
})
  .use(betterAuth)
  .post(
    "/",
    async (ctx) => {
      const user = ctx.user as { id: string; email: string; name?: string } | undefined;

      if (!user?.email) {
        return ctx.status(401, { success: false, error: "Nao autenticado" });
      }

      let dbUser = await UserRepository.findByEmail(user.email);

      if (!dbUser) {
        dbUser = await UserRepository.create({
          email: user.email,
          name: user.name || user.email.split("@")[0] || "",
          password_hash: "",
        });
      }

      if (!dbUser) {
        return ctx.status(500, { success: false, error: "Falha ao sincronizar usuario" });
      }

      try {
        const recommendation = await recommendationService.createRecommendation({
          title: ctx.body.title,
          artist: ctx.body.artist,
          genre: ctx.body.genre,
          description: ctx.body.description,
          tags: ctx.body.tags,
          mediaUrl: ctx.body.mediaUrl,
          userId: dbUser.id,
        });

        return { success: true, data: recommendation };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Erro ao criar recomendacao";
        return ctx.status(400, { success: false, error: message });
      }
    },
    {
      body: t.Object({
        title: t.String({ minLength: 1, maxLength: 255 }),
        artist: t.String({ minLength: 1, maxLength: 255 }),
        genre: t.String({ minLength: 1, maxLength: 100 }),
        description: t.String({ minLength: 10, maxLength: 500 }),
        tags: t.Array(t.String(), { minItems: 1, maxItems: 10 }),
        mediaUrl: t.Optional(t.String()),
      }),
      auth: true,
      detail: {
        tags: ["Recommendations"],
        summary: "Criar nova recomendacao de musica",
      },
    }
  )
  .post(
    "/:id/vote",
    async (ctx) => {
      const user = ctx.user as { id: string; email: string; name?: string } | undefined;

      if (!user?.email) {
        return ctx.status(401, { success: false, error: "Nao autenticado" });
      }

      const dbUser = await UserRepository.findByEmail(user.email);

      if (!dbUser) {
        return ctx.status(401, { success: false, error: "Usuario nao encontrado" });
      }

      const postId = parseInt(ctx.params.id);
      if (isNaN(postId)) {
        return ctx.status(400, { success: false, error: "ID invalido" });
      }

      try {
        const result = await recommendationService.vote({
          postId,
          userId: dbUser.id,
          voteType: ctx.body.voteType,
        });

        return { success: true, data: result };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Erro ao votar";
        return ctx.status(400, { success: false, error: message });
      }
    },
    {
      body: t.Object({
        voteType: t.Union([t.Literal("upvote"), t.Literal("downvote")]),
      }),
      auth: true,
      detail: {
        tags: ["Recommendations"],
        summary: "Votar em uma recomendacao",
      },
    }
  )
  .get(
    "/",
    async (ctx) => {
      const limit = Math.min(ctx.query.limit ? parseInt(ctx.query.limit) : 10, 100);
      const offset = ctx.query.offset ? parseInt(ctx.query.offset) : 0;

      // check session manually (without blocking if not logged in)
      let currentUserId: number | undefined;
      try {
        const session = await auth.api.getSession({
          headers: ctx.request.headers,
        });
        if (session?.user?.email) {
          const dbUser = await UserRepository.findByEmail(session.user.email);
          currentUserId = dbUser?.id;
        }
      } catch {
        // not logged in, that's fine
      }

      try {
        const recommendations = await recommendationService.getRecommendations(
          limit,
          offset,
          currentUserId
        );
        return {
          success: true,
          data: recommendations,
          pagination: { limit, offset },
        };
      } catch (err) {
        return {
          success: false,
          data: [],
          pagination: { limit, offset },
        };
      }
    },
    {
      query: t.Object({
        limit: t.Optional(t.String()),
        offset: t.Optional(t.String()),
      }),
      detail: {
        tags: ["Recommendations"],
        summary: "Listar recomendacoes",
      },
    }
  );