import { Elysia, t } from "elysia";
import { CommentService } from "./service";
import { betterAuth } from "../../core/auth/macro";
import { UserRepository } from "../perfil/repository";

const commentService = new CommentService();

export const commentRoutes = new Elysia({ prefix: "/posts/:postId/comments" })
  .use(betterAuth)
  .get(
    "/",
    async ({ params, query }) => {
      const postId = Number(params.postId);
      const limit = query.limit ?? 20;
      const offset = query.offset ?? 0;

      const result = await commentService.getComments(postId, limit, offset);
      return { success: true, data: result };
    },
    {
      params: t.Object({ postId: t.String() }),
      query: t.Object({
        limit: t.Optional(t.Numeric({ default: 20 })),
        offset: t.Optional(t.Numeric({ default: 0 })),
      }),
      detail: { tags: ["Comments"], summary: "Listar comentarios de um post" },
    }
  )
  .post(
    "/",
    async (ctx) => {
      const user = ctx.user as { email: string } | undefined;
      if (!user?.email) return ctx.status(401, { success: false, error: "Nao autenticado" });

      const dbUser = await UserRepository.findByEmail(user.email);
      if (!dbUser) return ctx.status(401, { success: false, error: "Usuario nao encontrado" });

      const postId = Number(ctx.params.postId);
      const comment = await commentService.addComment(dbUser.id, postId, ctx.body.content);
    if (!comment) return ctx.status(404, {success: false, error: "Comment does not exist"})
      return {
        success: true,
        data: {
          id: comment.id,
          content: comment.content,
          createdAt: comment.created_at,
          user: { id: dbUser.id, name: dbUser.name, avatar: dbUser.profile_picture_url },
        },
      };
    },
    {
      params: t.Object({ postId: t.String() }),
      body: t.Object({ content: t.String({ minLength: 1, maxLength: 1000 }) }),
      auth: true,
      detail: { tags: ["Comments"], summary: "Adicionar comentario" },
    }
  )
  .delete(
    "/:commentId",
    async (ctx) => {
      const user = ctx.user as { email: string } | undefined;
      if (!user?.email) return ctx.status(401, { success: false, error: "Nao autenticado" });

      const dbUser = await UserRepository.findByEmail(user.email);
      if (!dbUser) return ctx.status(401, { success: false, error: "Usuario nao encontrado" });

      const deleted = await commentService.removeComment(
        Number(ctx.params.commentId),
        dbUser.id,
        Number(ctx.params.postId)
      );

      if (!deleted) return ctx.status(404, { success: false, error: "Comentario nao encontrado" });
      return { success: true };
    },
    {
      params: t.Object({ postId: t.String(), commentId: t.String() }),
      auth: true,
      detail: { tags: ["Comments"], summary: "Remover comentario" },
    }
  );