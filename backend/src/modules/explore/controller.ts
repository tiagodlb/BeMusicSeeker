import { Elysia, t } from "elysia";
import { ExploreService } from "./service";
import { betterAuth } from "../../core/auth/macro";
import { UserRepository } from "../perfil/repository";
import { auth } from "../../core/auth/auth";

const exploreService = new ExploreService();

export const exploreRoutes = new Elysia({ prefix: "/explore" })
  .use(betterAuth)
  .get(
    "/",
    async (ctx) => {
      let currentUserId: number | undefined;

      // try to get user from session (optional auth)
      try {
        const session = await auth.api.getSession({
          headers: ctx.request.headers,
        });
        if (session?.user?.email) {
          const dbUser = await UserRepository.findByEmail(session.user.email);
          currentUserId = dbUser?.id;
        }
      } catch {
        // anonymous user, continue without personalization
      }

      const data = await exploreService.getExploreData(currentUserId);
      return { success: true, data };
    },
    {
      detail: { tags: ["Explore"], summary: "Dados da pagina explorar" },
    }
  )
  .get(
    "/suggestions",
    async (ctx) => {
      const user = ctx.user as { email: string } | undefined;
      if (!user?.email)
        return ctx.status(401, { success: false, error: "Nao autenticado" });

      const dbUser = await UserRepository.findByEmail(user.email);
      if (!dbUser)
        return ctx.status(401, {
          success: false,
          error: "Usuario nao encontrado",
        });

      const limit = ctx.query.limit ?? 20;
      const suggestions = await exploreService.getSuggestedUsers(
        dbUser.id,
        limit
      );

      return { success: true, data: suggestions };
    },
    {
      query: t.Object({
        limit: t.Optional(t.Numeric({ default: 20 })),
      }),
      auth: true,
      detail: {
        tags: ["Explore"],
        summary: "Sugestoes de usuarios para seguir",
      },
    }
  )
  .get(
    "/search",
    async ({ query }) => {
      const { q, type } = query;

      if (!q || q.length < 2) {
        return {
          success: false,
          error: "Query deve ter pelo menos 2 caracteres",
        };
      }

      const validTypes = ["users", "songs", "all"] as const;
      const searchType = validTypes.includes(type as any)
        ? (type as "users" | "songs" | "all")
        : "all";

      const results = await exploreService.search(q, searchType);
      return { success: true, data: results };
    },
    {
      query: t.Object({
        q: t.String(),
        type: t.Optional(t.String()),
      }),
      detail: { tags: ["Explore"], summary: "Buscar usuarios e musicas" },
    }
  );
