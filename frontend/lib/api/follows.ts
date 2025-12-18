const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface FollowUser {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  isArtist: boolean;
  followedAt: string;
  isFollowingBack?: boolean;
  stats: {
    followers: number;
    recommendations: number;
  };
}

export interface FollowsResponse {
  users: FollowUser[];
  total: number;
  hasMore: boolean;
}

export interface FollowStats {
  followers: number;
  following: number;
  recommendations: number;
}

export async function getFollowing(
  limit = 20,
  offset = 0
): Promise<{ success: boolean; data?: FollowsResponse; error?: string }> {
  const res = await fetch(
    `${API_URL}/v1/follows/following?limit=${limit}&offset=${offset}`,
    { credentials: "include" }
  );
  return res.json();
}

export async function getFollowers(
  limit = 20,
  offset = 0
): Promise<{ success: boolean; data?: FollowsResponse; error?: string }> {
  const res = await fetch(
    `${API_URL}/v1/follows/followers?limit=${limit}&offset=${offset}`,
    { credentials: "include" }
  );
  return res.json();
}

export async function getUserFollowing(
  userId: number,
  limit = 20,
  offset = 0
): Promise<{ success: boolean; data?: FollowsResponse; error?: string }> {
  const res = await fetch(
    `${API_URL}/v1/follows/user/${userId}/following?limit=${limit}&offset=${offset}`,
    { credentials: "include" }
  );
  return res.json();
}

export async function getUserFollowers(
  userId: number,
  limit = 20,
  offset = 0
): Promise<{ success: boolean; data?: FollowsResponse; error?: string }> {
  const res = await fetch(
    `${API_URL}/v1/follows/user/${userId}/followers?limit=${limit}&offset=${offset}`,
    { credentials: "include" }
  );
  return res.json();
}

export async function getUserStats(
  userId: number
): Promise<{ success: boolean; data?: FollowStats; error?: string }> {
  const res = await fetch(`${API_URL}/v1/follows/user/${userId}/stats`, {
    credentials: "include",
  });
  return res.json();
}

export async function toggleFollow(
  userId: number
): Promise<{ success: boolean; data?: { action: string; isFollowing: boolean }; error?: string }> {
  const res = await fetch(`${API_URL}/v1/follows/${userId}`, {
    method: "POST",
    credentials: "include",
  });
  return res.json();
}

export async function getFollowStatus(
  userId: number
): Promise<{ success: boolean; data?: { isFollowing: boolean }; error?: string }> {
  const res = await fetch(`${API_URL}/v1/follows/${userId}/status`, {
    credentials: "include",
  });
  return res.json();
}