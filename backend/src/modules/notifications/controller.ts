import { Elysia, t } from "elysia";
import { NotificationService } from "./service";
import { betterAuth } from "../../core/auth/macro";
import { UserRepository } from "../perfil/repository";

const notificationService = new NotificationService();

export const notificationRoutes = new Elysia({ prefix: "/notifications" })
  .use(betterAuth)
  .get(
    "/",
    async (ctx) => {
      const user = ctx.user as
        | { id: string; email: string; name?: string }
        | undefined;

      if (!user?.email) {
        return ctx.set.status = 401;
      }

      const dbUser = await UserRepository.findByEmail(user.email);

      if (!dbUser) {
        return ctx.set.status = 404;
      }

      const page = ctx.query.page ?? 1;
      const limit = ctx.query.limit ?? 20;

      const data = await notificationService.getNotifications(
        dbUser.id,
        page,
        limit
      );
      return { success: true, data };
    },
    {
      query: t.Object({
        page: t.Optional(t.Numeric({ default: 1 })),
        limit: t.Optional(t.Numeric({ default: 20 })),
      }),
      auth: true,
      detail: { tags: ["Notifications"], summary: "Listar notificações" },
    }
  )
  .get(
    "/unread-count",
    async (ctx) => {
      const user = ctx.user as
        | { id: string; email: string; name?: string }
        | undefined;

      if (!user?.email) {
        return ctx.set.status = 401;
      }

      const dbUser = await UserRepository.findByEmail(user.email);

      if (!dbUser) {
        return ctx.set.status = 404;
      }

      const count = await notificationService.getUnreadCount(dbUser.id);
      return { success: true, data: { count } };
    },
    {
      auth: true,
      detail: { tags: ["Notifications"], summary: "Contagem de não lidas" },
    }
  )
  .patch(
    "/:id/read",
    async (ctx) => {
      const user = ctx.user as
        | { id: string; email: string; name?: string }
        | undefined;

      if (!user?.email) {
        return ctx.set.status = 401;
      }

      const dbUser = await UserRepository.findByEmail(user.email);

      if (!dbUser) {
        return ctx.set.status = 404;
      }

      await notificationService.markAsRead(Number(ctx.params.id), dbUser.id);
      return { success: true };
    },
    {
      params: t.Object({ id: t.Numeric() }),
      auth: true,
      detail: { tags: ["Notifications"], summary: "Marcar uma como lida" },
    }
  )
  .patch(
    "/mark-all-read",
    async (ctx) => {
      const user = ctx.user as
        | { id: string; email: string; name?: string }
        | undefined;

      if (!user?.email) {
        return ctx.set.status = 401;
      }

      const dbUser = await UserRepository.findByEmail(user.email);

      if (!dbUser) {
        return ctx.set.status = 404;
      }

      await notificationService.markAllAsRead(dbUser.id);
      return { success: true };
    },
    {
      auth: true,
      detail: { tags: ["Notifications"], summary: "Marcar todas como lidas" },
    }
  );