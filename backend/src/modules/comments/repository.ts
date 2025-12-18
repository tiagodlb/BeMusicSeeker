import { prisma } from "../../db/client";

export abstract class CommentRepository {
  static async findByPostId(postId: number, limit = 20, offset = 0) {
    return prisma
      .selectFrom("comments")
      .innerJoin("users", "users.id", "comments.user_id")
      .select([
        "comments.id",
        "comments.content",
        "comments.created_at",
        "comments.user_id",
        "users.name as user_name",
        "users.profile_picture_url as user_avatar",
      ])
      .where("comments.post_id", "=", postId)
      .orderBy("comments.created_at", "desc")
      .limit(limit)
      .offset(offset)
      .execute();
  }

  static async create(data: { userId: number; postId: number; content: string }) {
    const [comment] = await prisma
      .insertInto("comments")
      .values({
        user_id: data.userId,
        post_id: data.postId,
        content: data.content,
      })
      .returning(["id", "content", "created_at", "user_id"])
      .execute();
    return comment;
  }

  static async delete(id: number, userId: number) {
    const result = await prisma
      .deleteFrom("comments")
      .where("id", "=", id)
      .where("user_id", "=", userId)
      .executeTakeFirst();
    return (result.numDeletedRows ?? 0n) > 0n;
  }

  static async countByPostId(postId: number) {
    const result = await prisma
      .selectFrom("comments")
      .select(prisma.fn.count("id").as("count"))
      .where("post_id", "=", postId)
      .executeTakeFirst();
    return Number(result?.count ?? 0);
  }
}