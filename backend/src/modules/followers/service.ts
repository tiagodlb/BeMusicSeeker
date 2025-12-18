import { FollowRepository } from "./repository";

export class FollowService {
  async getFollowing(userId: number, limit = 20, offset = 0) {
    const [following, total] = await Promise.all([
      FollowRepository.findFollowing(userId, limit, offset),
      FollowRepository.countFollowing(userId),
    ]);

    const enriched = await Promise.all(
      following.map(async (f) => {
        const [followersCount, recommendationsCount] = await Promise.all([
          FollowRepository.countFollowers(f.user_id),
          FollowRepository.getRecommendationsCount(f.user_id),
        ]);

        return {
          id: f.user_id,
          name: f.user_name,
          email: f.user_email,
          bio: f.user_bio,
          avatar: f.user_avatar,
          isArtist: f.user_is_artist,
          followedAt: f.created_at,
          stats: {
            followers: followersCount,
            recommendations: recommendationsCount,
          },
        };
      })
    );

    return {
      users: enriched,
      total,
      hasMore: offset + following.length < total,
    };
  }

  async getFollowers(userId: number, limit = 20, offset = 0) {
    const [followers, total] = await Promise.all([
      FollowRepository.findFollowers(userId, limit, offset),
      FollowRepository.countFollowers(userId),
    ]);

    const enriched = await Promise.all(
      followers.map(async (f) => {
        const [followersCount, recommendationsCount, isFollowingBack] = await Promise.all([
          FollowRepository.countFollowers(f.user_id),
          FollowRepository.getRecommendationsCount(f.user_id),
          FollowRepository.findByUsers(userId, f.user_id).then((r) => !!r),
        ]);

        return {
          id: f.user_id,
          name: f.user_name,
          email: f.user_email,
          bio: f.user_bio,
          avatar: f.user_avatar,
          isArtist: f.user_is_artist,
          followedAt: f.created_at,
          isFollowingBack,
          stats: {
            followers: followersCount,
            recommendations: recommendationsCount,
          },
        };
      })
    );

    return {
      users: enriched,
      total,
      hasMore: offset + followers.length < total,
    };
  }

  async toggleFollow(followerId: number, followingId: number) {
    if (followerId === followingId) {
      throw new Error("Voce nao pode seguir a si mesmo");
    }

    const existing = await FollowRepository.findByUsers(followerId, followingId);

    if (existing) {
      await FollowRepository.delete(followerId, followingId);
      return { action: "unfollowed", isFollowing: false };
    }

    await FollowRepository.create(followerId, followingId);
    return { action: "followed", isFollowing: true };
  }

  async isFollowing(followerId: number, followingId: number) {
    const existing = await FollowRepository.findByUsers(followerId, followingId);
    return !!existing;
  }

  async getStats(userId: number) {
    const [followers, following, recommendations] = await Promise.all([
      FollowRepository.countFollowers(userId),
      FollowRepository.countFollowing(userId),
      FollowRepository.getRecommendationsCount(userId),
    ]);

    return { followers, following, recommendations };
  }
}