import { prisma } from "../../db/client";
import { sql } from "kysely";

export abstract class ExploreRepository {
  static async getPopularUsers(limit = 10, excludeUserId?: number) {
    let query = prisma
      .selectFrom("users")
      .leftJoin("follows", "follows.following_id", "users.id")
      .select([
        "users.id",
        "users.name",
        "users.email",
        "users.bio",
        "users.profile_picture_url",
        "users.is_artist",
        "users.created_at",
      ])
      .select((eb) => eb.fn.count("follows.id").as("followers_count"))
      .groupBy("users.id")
      .orderBy("followers_count", "desc")
      .limit(limit);

    if (excludeUserId) {
      query = query.where("users.id", "!=", excludeUserId);
    }

    return query.execute();
  }

  static async getRecentUsers(limit = 10, excludeUserId?: number) {
    let query = prisma
      .selectFrom("users")
      .select([
        "id",
        "name",
        "email",
        "bio",
        "profile_picture_url",
        "is_artist",
        "created_at",
      ])
      .orderBy("created_at", "desc")
      .limit(limit);

    if (excludeUserId) {
      query = query.where("id", "!=", excludeUserId);
    }

    return query.execute();
  }

  static async getTrendingPosts(limit = 10, days = 7) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    return prisma
      .selectFrom("posts")
      .innerJoin("users", "users.id", "posts.user_id")
      .innerJoin("songs", "songs.id", "posts.song_id")
      .select([
        "posts.id",
        "posts.content",
        "posts.upvotes_count",
        "posts.downvotes_count",
        "posts.comments_count",
        "posts.created_at",
        "users.id as user_id",
        "users.name as user_name",
        "users.profile_picture_url as user_avatar",
        "songs.id as song_id",
        "songs.title as song_title",
        "songs.genre as song_genre",
        "songs.cover_image_url as song_cover",
        "songs.file_url as song_url",
      ])
      .where("posts.created_at", ">=", since)
      .orderBy("posts.upvotes_count", "desc")
      .limit(limit)
      .execute();
  }

  static async getPopularTags(limit = 20) {
    return prisma
      .selectFrom("post_tags")
      .select(["tag"])
      .select((eb) => eb.fn.count("id").as("count"))
      .groupBy("tag")
      .orderBy("count", "desc")
      .limit(limit)
      .execute();
  }

  static async getPopularGenres(limit = 10) {
    return prisma
      .selectFrom("songs")
      .select(["genre"])
      .select((eb) => eb.fn.count("id").as("count"))
      .groupBy("genre")
      .orderBy("count", "desc")
      .limit(limit)
      .execute();
  }

  static async searchUsers(query: string, limit = 20) {
    return prisma
      .selectFrom("users")
      .select([
        "id",
        "name",
        "email",
        "bio",
        "profile_picture_url",
        "is_artist",
      ])
      .where(sql`lower(name)`, "like", `%${query.toLowerCase()}%`)
      .limit(limit)
      .execute();
  }

  static async searchSongs(query: string, limit = 20) {
    const lowerQuery = `%${query.toLowerCase()}%`;
    
    return prisma
      .selectFrom("songs")
      .innerJoin("users", "users.id", "songs.artist_id")
      .select([
        "songs.id",
        "songs.title",
        "songs.genre",
        "songs.cover_image_url",
        "songs.file_url",
        "users.id as artist_id",
        "users.name as artist_name",
      ])
      .where((eb) =>
        eb.or([
          eb(sql`lower(songs.title)`, "like", lowerQuery),
          eb(sql`lower(users.name)`, "like", lowerQuery),
        ])
      )
      .limit(limit)
      .execute();
  }

  static async getFollowingIds(userId: number) {
    const follows = await prisma
      .selectFrom("follows")
      .select(["following_id"])
      .where("follower_id", "=", userId)
      .execute();
    return follows.map((f) => f.following_id);
  }
}