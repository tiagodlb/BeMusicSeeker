import { Elysia, t } from "elysia";
import { RecommendationService } from "./service";

const recommendationService = new RecommendationService();

export const recommendationRoutes = new Elysia({
  prefix: "/recommendations",
})
  // POST /recommendations - Criar nova recomendação
  .post(
    "/",
    async ({ body, user }: { body: any; user?: any }) => {
      if (!user?.id) {
        throw new Error("Usuário não autenticado");
      }

      try {
        const recommendation =
          await recommendationService.createRecommendation({
            title: body.title,
            artist: body.artist,
            genre: body.genre,
            description: body.description,
            tags: body.tags,
            mediaUrl: body.mediaUrl,
            userId: user.id,
          });

        return {
          success: true,
          data: recommendation,
        };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao criar recomendação";
        throw new Error(errorMessage);
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
        summary: "Criar nova recomendação de música",
        description: "Cria uma nova recomendação de música com tags",
      },
    }
  )

  // GET /recommendations - Listar recomendações
  .get(
    "/",
    async ({ query }) => {
      const limit = Math.min(query.limit ? parseInt(query.limit) : 10, 100);
      const offset = query.offset ? parseInt(query.offset) : 0;

      const recommendations =
        await recommendationService.getRecommendations(limit, offset);

      return {
        success: true,
        data: recommendations,
        pagination: {
          limit,
          offset,
        },
      };
    },
    {
      query: t.Object({
        limit: t.Optional(t.String()),
        offset: t.Optional(t.String()),
      }),
      detail: {
        tags: ["Recommendations"],
        summary: "Listar recomendações",
        description: "Lista todas as recomendações de músicas com paginação",
      },
    }
  );
