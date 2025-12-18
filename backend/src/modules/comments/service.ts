import { CommentRepository } from "./repository";
import { prisma } from "../../db/client";

export class CommentService {
  async getComments(postId: number, limit = 20, offset = 0) {
    const [comments, total] = await Promise.all([
      CommentRepository.findByPostId(postId, limit, offset),
      CommentRepository.countByPostId(postId),
    ]);

    return {
      comments: comments.map((c) => ({
        id: c.id,
        content: c.content,
        createdAt: c.created_at,
        user: {
          id: c.user_id,
          name: c.user_name,
          avatar: c.user_avatar,
        },
      })),
      total,
      hasMore: offset + comments.length < total,
    };
  }

  async addComment(userId: number, postId: number, content: string) {
    const comment = await CommentRepository.create({ userId, postId, content });

    await prisma
      .updateTable("posts")
      .set((eb) => ({ comments_count: eb("comments_count", "+", 1) }))
      .where("id", "=", postId)
      .execute();

    return comment;
  }

  async removeComment(commentId: number, userId: number, postId: number) {
    const deleted = await CommentRepository.delete(commentId, userId);

    if (deleted) {
      await prisma
        .updateTable("posts")
        .set((eb) => ({ comments_count: eb("comments_count", "-", 1) }))
        .where("id", "=", postId)
        .execute();
    }

    return deleted;
  }
}