import { Elysia, t } from "elysia";
import { RecommendationService } from "./service";
import { betterAuth } from "../core/auth/macro";
import { auth } from "../core/auth/auth";
import { UserRepository } from "../modules/perfil/repository";
import { mkdir } from "node:fs/promises";
import { NotificationRepository } from "../modules/notifications/repository";
import { prisma } from "../db/client";

const recommendationService = new RecommendationService();

export const recommendationRoutes = new Elysia({
  prefix: "/recommendations",
})
  .use(betterAuth)
  .post(
    "/",
    async (ctx) => {
      const user = ctx.user as
        | { id: string; email: string; name?: string }
        | undefined;

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
        return ctx.status(500, {
          success: false,
          error: "Falha ao sincronizar usuario",
        });
      }

      try {
        // 1. Processar a Imagem (Upload Local)
        let coverImageUrl: string | undefined = undefined;

        // O arquivo vem em ctx.body.coverImage
        if (ctx.body.coverImage) {
          const file = ctx.body.coverImage;
          const uniqueSuffix = `${Date.now()}-${Math.round(
            Math.random() * 1e9
          )}`;
          const extension = file.name.split(".").pop() || "jpg";
          const fileName = `cover-${uniqueSuffix}.${extension}`;

          // Certifique-se que a pasta existe (public/uploads)
          // OBS: No seu index.ts principal, você deve servir a pasta public como estática
          const uploadDir = "./public/uploads";
          await mkdir(uploadDir, { recursive: true });

          await Bun.write(`${uploadDir}/${fileName}`, file);
          coverImageUrl = `/uploads/${fileName}`; // Caminho relativo para salvar no banco
        }

        // 2. Processar Tags (FormData envia array como string JSON)
        let parsedTags: string[] = [];
        try {
          parsedTags = JSON.parse(ctx.body.tags);
        } catch (e) {
          return ctx.status(400, {
            success: false,
            error: "Formato de tags inválido",
          });
        }

        // 3. Chamar Service
        const recommendation = await recommendationService.createRecommendation(
          {
            title: ctx.body.title,
            artist: ctx.body.artist,
            genre: ctx.body.genre,
            description: ctx.body.description,
            tags: parsedTags,
            mediaUrl: ctx.body.mediaUrl,
            coverImageUrl: coverImageUrl, // Passando a URL da imagem
            userId: dbUser!.id,
          }
        );

        return { success: true, data: recommendation };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro ao criar recomendacao";
        console.error(err); // Bom para debug
        return ctx.status(400, { success: false, error: message });
      }
    },
    {
      // Schema atualizado para suportar Arquivo e FormData
      body: t.Object({
        title: t.String({ minLength: 1, maxLength: 255 }),
        artist: t.String({ minLength: 1, maxLength: 255 }),
        genre: t.String({ minLength: 1, maxLength: 100 }),
        description: t.String({ minLength: 10, maxLength: 500 }),
        tags: t.String(), // Mudou de t.Array para t.String pois vem JSON.stringify do FormData
        mediaUrl: t.Optional(t.String()),
        coverImage: t.Optional(t.File()), // Novo campo de arquivo
      }),
      auth: true,
      detail: {
        tags: ["Recommendations"],
        summary: "Criar nova recomendacao de musica com capa",
      },
    }
  )
  .post(
    "/:id/vote",
    async (ctx) => {
      const user = ctx.user as
        | { id: string; email: string; name?: string }
        | undefined;

      if (!user?.email) {
        ctx.set.status = 401;
        return { success: false, error: "Não autenticado" };
      }

      const dbUser = await UserRepository.findByEmail(user.email);
      if (!dbUser) {
        ctx.set.status = 404;
        return { success: false, error: "Usuário não encontrado" };
      }

      const postId = Number(ctx.params.id);
      const { voteType } = ctx.body;

      // ✅ Processar o voto
      const voteResult = await recommendationService.vote({
        postId,
        userId: dbUser.id,
        voteType,
      });

      // ✅ CRIAR NOTIFICAÇÃO (apenas para upvote criado)
      if (voteType === "upvote" && voteResult.action === "created") {
        try {
          // Buscar dono da recomendação
          const post = await prisma
            .selectFrom("posts")
            .select(["user_id"])
            .where("id", "=", postId)
            .executeTakeFirst();

          // Só notifica se não for voto próprio
          if (post && post.user_id !== dbUser.id) {
            await NotificationRepository.create({
              user_id: post.user_id,
              type: "vote",
              content: `${dbUser.name || "Alguém"} curtiu sua recomendação`,
              related_id: postId,
              related_type: "post",
            });
          }
        } catch (error) {
          console.error("❌ Erro ao criar notificação:", error);
        }
      }

      return { success: true, data: voteResult };
    },
    {
      params: t.Object({ id: t.Numeric() }),
      body: t.Object({
        voteType: t.Union([t.Literal("upvote"), t.Literal("downvote")]),
      }),
      auth: true,
      detail: { tags: ["Recommendations"], summary: "Votar em recomendação" },
    }
  )
  .get(
    "/",
    async (ctx) => {
      const limit = Math.min(
        ctx.query.limit ? parseInt(ctx.query.limit) : 10,
        100
      );
      const offset = ctx.query.offset ? parseInt(ctx.query.offset) : 0;
      const filterUserId = ctx.query.userId
        ? parseInt(ctx.query.userId)
        : undefined;
      const sortBy =
        (ctx.query.sortBy as "recent" | "trending" | "top") || "recent";
      const period =
        (ctx.query.period as "today" | "week" | "month" | "all") || "all";
      const genre = ctx.query.genre;

      let currentUserId: number | undefined;
      try {
        const session = await auth.api.getSession({
          headers: ctx.request.headers,
        });
        if (session?.user?.email) {
          const dbUser = await UserRepository.findByEmail(session.user.email);
          currentUserId = dbUser?.id;
        }
      } catch {}

      try {
        const recommendations = await recommendationService.getRecommendations(
          limit,
          offset,
          currentUserId,
          filterUserId,
          sortBy,
          period,
          genre
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
        userId: t.Optional(t.String()),
        sortBy: t.Optional(t.String()),
        period: t.Optional(t.String()),
        genre: t.Optional(t.String()),
      }),
      detail: {
        tags: ["Recommendations"],
        summary: "Listar recomendacoes",
      },
    }
  )
  .get(
    "/rankings",
    async (ctx) => {
      const limit = Math.min(
        ctx.query.limit ? parseInt(ctx.query.limit) : 20,
        100
      );
      const type = (ctx.query.type as "curators" | "artists") || "curators";
      const period = (ctx.query.period as "week" | "month" | "all") || "all";

      try {
        const rankings = await recommendationService.getRankings(
          limit,
          type,
          period
        );
        return {
          success: true,
          data: rankings,
        };
      } catch (err) {
        console.error("Rankings error:", err);
        return {
          success: false,
          data: [],
        };
      }
    },
    {
      query: t.Object({
        limit: t.Optional(t.String()),
        type: t.Optional(t.String()),
        period: t.Optional(t.String()),
      }),
      detail: {
        tags: ["Recommendations"],
        summary: "Rankings de curadores e artistas",
      },
    }
  );
