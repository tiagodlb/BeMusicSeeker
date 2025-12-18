import { prisma } from "../../db/client";

export abstract class FollowRepository {
  static async findFollowing(userId: number, limit = 20, offset = 0) {
    return prisma
      .selectFrom("follows")
      .innerJoin("users", "users.id", "follows.following_id")
      .select([
        "follows.id",
        "follows.created_at",
        "users.id as user_id",
        "users.name as user_name",
        "users.email as user_email",
        "users.bio as user_bio",
        "users.profile_picture_url as user_avatar",
        "users.is_artist as user_is_artist",
      ])
      .where("follows.follower_id", "=", userId)
      .orderBy("follows.created_at", "desc")
      .limit(limit)
      .offset(offset)
      .execute();
  }

  static async findFollowers(userId: number, limit = 20, offset = 0) {
    return prisma
      .selectFrom("follows")
      .innerJoin("users", "users.id", "follows.follower_id")
      .select([
        "follows.id",
        "follows.created_at",
        "users.id as user_id",
        "users.name as user_name",
        "users.email as user_email",
        "users.bio as user_bio",
        "users.profile_picture_url as user_avatar",
        "users.is_artist as user_is_artist",
      ])
      .where("follows.following_id", "=", userId)
      .orderBy("follows.created_at", "desc")
      .limit(limit)
      .offset(offset)
      .execute();
  }

  static async countFollowing(userId: number) {
    const result = await prisma
      .selectFrom("follows")
      .select(prisma.fn.count("id").as("count"))
      .where("follower_id", "=", userId)
      .executeTakeFirst();
    return Number(result?.count ?? 0);
  }

  static async countFollowers(userId: number) {
    const result = await prisma
      .selectFrom("follows")
      .select(prisma.fn.count("id").as("count"))
      .where("following_id", "=", userId)
      .executeTakeFirst();
    return Number(result?.count ?? 0);
  }

  static async findByUsers(followerId: number, followingId: number) {
    return prisma
      .selectFrom("follows")
      .where("follower_id", "=", followerId)
      .where("following_id", "=", followingId)
      .selectAll()
      .executeTakeFirst();
  }

  static async create(followerId: number, followingId: number) {
    const [follow] = await prisma
      .insertInto("follows")
      .values({
        follower_id: followerId,
        following_id: followingId,
      })
      .returning(["id", "created_at"])
      .execute();
    return follow;
  }

  static async delete(followerId: number, followingId: number) {
    const result = await prisma
      .deleteFrom("follows")
      .where("follower_id", "=", followerId)
      .where("following_id", "=", followingId)
      .executeTakeFirst();
    return (result.numDeletedRows ?? 0n) > 0n;
  }

  static async getRecommendationsCount(userId: number) {
    const result = await prisma
      .selectFrom("posts")
      .select(prisma.fn.count("id").as("count"))
      .where("user_id", "=", userId)
      .executeTakeFirst();
    return Number(result?.count ?? 0);
  }
}