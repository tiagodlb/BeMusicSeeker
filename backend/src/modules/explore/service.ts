import { ExploreRepository } from "./repository";
import { FollowRepository } from "../followers/repository";

export class ExploreService {
  async getExploreData(currentUserId?: number) {
    const [popularUsers, recentUsers, trendingPosts, popularTags, popularGenres] =
      await Promise.all([
        ExploreRepository.getPopularUsers(10, currentUserId),
        ExploreRepository.getRecentUsers(10, currentUserId),
        ExploreRepository.getTrendingPosts(10),
        ExploreRepository.getPopularTags(15),
        ExploreRepository.getPopularGenres(10),
      ]);

    // get following ids if user is logged in
    let followingIds: number[] = [];
    if (currentUserId) {
      followingIds = await ExploreRepository.getFollowingIds(currentUserId);
    }

    const followingSet = new Set(followingIds);

    const enrichedPopularUsers = await Promise.all(
      popularUsers.map(async (u) => {
        const [followersCount, recommendationsCount] = await Promise.all([
          FollowRepository.countFollowers(u.id),
          FollowRepository.getRecommendationsCount(u.id),
        ]);

        return {
          id: u.id,
          name: u.name,
          bio: u.bio,
          avatar: u.profile_picture_url,
          isArtist: u.is_artist,
          isFollowing: followingSet.has(u.id),
          stats: {
            followers: followersCount,
            recommendations: recommendationsCount,
          },
        };
      })
    );

    const enrichedRecentUsers = await Promise.all(
      recentUsers.map(async (u) => {
        const followersCount = await FollowRepository.countFollowers(u.id);

        return {
          id: u.id,
          name: u.name,
          bio: u.bio,
          avatar: u.profile_picture_url,
          isArtist: u.is_artist,
          isFollowing: followingSet.has(u.id),
          createdAt: u.created_at,
          stats: {
            followers: followersCount,
          },
        };
      })
    );

    const formattedPosts = trendingPosts.map((p) => ({
      id: p.id,
      content: p.content,
      createdAt: p.created_at,
      stats: {
        upvotes: p.upvotes_count,
        downvotes: p.downvotes_count,
        comments: p.comments_count,
      },
      user: {
        id: p.user_id,
        name: p.user_name,
        avatar: p.user_avatar,
      },
      song: {
        id: p.song_id,
        title: p.song_title,
        genre: p.song_genre,
        coverUrl: p.song_cover,
        url: p.song_url,
      },
    }));

    return {
      popularUsers: enrichedPopularUsers,
      recentUsers: enrichedRecentUsers,
      trendingPosts: formattedPosts,
      popularTags: popularTags.map((t) => ({ tag: t.tag, count: Number(t.count) })),
      popularGenres: popularGenres.map((g) => ({ genre: g.genre, count: Number(g.count) })),
    };
  }

  async getSuggestedUsers(currentUserId: number, limit = 20) {
    const popularUsers = await ExploreRepository.getPopularUsers(limit, currentUserId);
    const followingIds = await ExploreRepository.getFollowingIds(currentUserId);
    const followingSet = new Set(followingIds);

    // filter out users already being followed
    const suggestions = popularUsers.filter((u) => !followingSet.has(u.id));

    return Promise.all(
      suggestions.map(async (u) => {
        const [followersCount, recommendationsCount] = await Promise.all([
          FollowRepository.countFollowers(u.id),
          FollowRepository.getRecommendationsCount(u.id),
        ]);

        return {
          id: u.id,
          name: u.name,
          bio: u.bio,
          avatar: u.profile_picture_url,
          isArtist: u.is_artist,
          stats: {
            followers: followersCount,
            recommendations: recommendationsCount,
          },
        };
      })
    );
  }

  async search(query: string, type: "users" | "songs" | "all" = "all") {
    if (type === "users") {
      const users = await ExploreRepository.searchUsers(query);
      return {
        users: users.map((u) => ({
          id: u.id,
          name: u.name,
          bio: u.bio,
          avatar: u.profile_picture_url,
          isArtist: u.is_artist,
        })),
        songs: [],
      };
    }

    if (type === "songs") {
      const songs = await ExploreRepository.searchSongs(query);
      return {
        users: [],
        songs: songs.map((s) => ({
          id: s.id,
          title: s.title,
          genre: s.genre,
          coverUrl: s.cover_image_url,
          url: s.file_url,
          artist: {
            id: s.artist_id,
            name: s.artist_name,
          },
        })),
      };
    }

    const [users, songs] = await Promise.all([
      ExploreRepository.searchUsers(query, 10),
      ExploreRepository.searchSongs(query, 10),
    ]);

    return {
      users: users.map((u) => ({
        id: u.id,
        name: u.name,
        bio: u.bio,
        avatar: u.profile_picture_url,
        isArtist: u.is_artist,
      })),
      songs: songs.map((s) => ({
        id: s.id,
        title: s.title,
        genre: s.genre,
        coverUrl: s.cover_image_url,
        url: s.file_url,
        artist: {
          id: s.artist_id,
          name: s.artist_name,
        },
      })),
    };
  }
}