import { FavoriteRepository } from "./repository";

export class FavoriteService {
  async getFavorites(userId: number, limit = 20, offset = 0) {
    const [favorites, total] = await Promise.all([
      FavoriteRepository.findByUserId(userId, limit, offset),
      FavoriteRepository.countByUserId(userId),
    ]);

    return {
      favorites: favorites.map((f) => ({
        id: f.id,
        savedAt: f.created_at,
        song: {
          id: f.song_id,
          title: f.song_title,
          genre: f.song_genre,
          coverUrl: f.song_cover,
          url: f.song_url,
          artist: {
            id: f.artist_id,
            name: f.artist_name,
          },
        },
      })),
      total,
      hasMore: offset + favorites.length < total,
    };
  }

  async checkFavorites(userId: number, songIds: number[]) {
    return FavoriteRepository.checkMultiple(userId, songIds);
  }

  async toggleFavorite(userId: number, songId: number) {
    const existing = await FavoriteRepository.findByUserAndSong(userId, songId);

    if (existing) {
      await FavoriteRepository.delete(userId, songId);
      return { action: "removed", isFavorite: false };
    }

    await FavoriteRepository.create(userId, songId);
    return { action: "added", isFavorite: true };
  }

  async isFavorite(userId: number, songId: number) {
    const existing = await FavoriteRepository.findByUserAndSong(userId, songId);
    return !!existing;
  }
}