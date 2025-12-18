import { prisma } from "../../db/client";

export abstract class FavoriteRepository {
  static async findByUserAndSong(userId: number, songId: number) {
    return prisma
      .selectFrom("saved_songs")
      .where("user_id", "=", userId)
      .where("song_id", "=", songId)
      .selectAll()
      .executeTakeFirst();
  }

  static async findByUserId(userId: number, limit = 20, offset = 0) {
    return prisma
      .selectFrom("saved_songs")
      .innerJoin("songs", "songs.id", "saved_songs.song_id")
      .innerJoin("users", "users.id", "songs.artist_id")
      .select([
        "saved_songs.id",
        "saved_songs.song_id",
        "saved_songs.created_at",
        "songs.title as song_title",
        "songs.genre as song_genre",
        "songs.cover_image_url as song_cover",
        "songs.file_url as song_url",
        "users.id as artist_id",
        "users.name as artist_name",
      ])
      .where("saved_songs.user_id", "=", userId)
      .orderBy("saved_songs.created_at", "desc")
      .limit(limit)
      .offset(offset)
      .execute();
  }

  static async countByUserId(userId: number) {
    const result = await prisma
      .selectFrom("saved_songs")
      .select(prisma.fn.count("id").as("count"))
      .where("user_id", "=", userId)
      .executeTakeFirst();
    return Number(result?.count ?? 0);
  }

  static async checkMultiple(userId: number, songIds: number[]) {
    if (songIds.length === 0) return [];
    
    const saved = await prisma
      .selectFrom("saved_songs")
      .select(["song_id"])
      .where("user_id", "=", userId)
      .where("song_id", "in", songIds)
      .execute();
    
    return saved.map((s) => s.song_id);
  }

  static async create(userId: number, songId: number) {
    const [saved] = await prisma
      .insertInto("saved_songs")
      .values({
        user_id: userId,
        song_id: songId,
      })
      .returning(["id", "song_id", "created_at"])
      .execute();
    return saved;
  }

  static async delete(userId: number, songId: number) {
    const result = await prisma
      .deleteFrom("saved_songs")
      .where("user_id", "=", userId)
      .where("song_id", "=", songId)
      .executeTakeFirst();
    return (result.numDeletedRows ?? 0n) > 0n;
  }
}