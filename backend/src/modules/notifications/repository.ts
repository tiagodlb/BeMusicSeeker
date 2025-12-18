import { prisma } from "../../db/client";
import { sql } from "kysely";

export abstract class NotificationRepository {
  static async getUserNotifications(userId: number, limit = 20, offset = 0) {
    return prisma
      .selectFrom("notifications")
      .selectAll()
      .where("user_id", "=", userId)
      .orderBy("created_at", "desc")
      .limit(limit)
      .offset(offset)
      .execute();
  }

  static async getUnreadCount(userId: number) {
    const result = await prisma
      .selectFrom("notifications")
      .select((eb) => eb.fn.count("id").as("count"))
      .where("user_id", "=", userId)
      .where("is_read", "=", false)
      .executeTakeFirst();

    return Number(result?.count || 0);
  }

  static async markAsRead(notificationId: number, userId: number) {
    return prisma
      .updateTable("notifications")
      .set({ is_read: true })
      .where("id", "=", notificationId)
      .where("user_id", "=", userId)
      .returningAll()
      .executeTakeFirst();
  }

  static async markAllAsRead(userId: number) {
    return prisma
      .updateTable("notifications")
      .set({ is_read: true })
      .where("user_id", "=", userId)
      .where("is_read", "=", false) // Só atualiza as que não foram lidas
      .execute();
  }

  static async create(data: {
    user_id: number;
    type: "comment" | "vote" | "follow" | "new_song" | "mention";
    content: string;
    related_id?: number | null;
    related_type?: "post" | "comment" | "song" | "user" | null;
  }) {
    return prisma
      .insertInto("notifications")
      .values({
        user_id: data.user_id,
        type: data.type,
        content: data.content,
        related_id: data.related_id ?? null,
        related_type: data.related_type ?? null,
        is_read: false,
        created_at: new Date().toISOString(),
      })
      .returningAll()
      .executeTakeFirst();
  }
}
