const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface ExploreUser {
  id: number;
  name: string;
  bio: string | null;
  avatar: string | null;
  isArtist: boolean;
  isFollowing?: boolean;
  createdAt?: string;
  stats: {
    followers: number;
    recommendations?: number;
  };
}

export interface ExploreSong {
  id: number;
  title: string;
  genre: string;
  coverUrl: string | null;
  url: string;
  artist: {
    id: number;
    name: string;
  };
}

export interface ExplorePost {
  id: number;
  content: string;
  createdAt: string;
  stats: {
    upvotes: number;
    downvotes: number;
    comments: number;
  };
  user: {
    id: number;
    name: string;
    avatar: string | null;
  };
  song: {
    id: number;
    title: string;
    genre: string;
    coverUrl: string | null;
    url: string;
  };
}

export interface ExploreData {
  popularUsers: ExploreUser[];
  recentUsers: ExploreUser[];
  trendingPosts: ExplorePost[];
  popularTags: { tag: string; count: number }[];
  popularGenres: { genre: string; count: number }[];
}

export interface SearchResults {
  users: {
    id: number;
    name: string;
    bio: string | null;
    avatar: string | null;
    isArtist: boolean;
  }[];
  songs: ExploreSong[];
}

export async function getExploreData(): Promise<{
  success: boolean;
  data?: ExploreData;
  error?: string;
}> {
  try {
    const res = await fetch(`${API_URL}/v1/explore`, {
      credentials: "include",
    });
    
    if (!res.ok) {
      return { success: false, error: `HTTP ${res.status}` };
    }
    
    const text = await res.text();
    if (!text) {
      return { success: false, error: "Empty response" };
    }
    
    return JSON.parse(text);
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Erro desconhecido" };
  }
}

export async function getSuggestions(
  limit = 20
): Promise<{ success: boolean; data?: ExploreUser[]; error?: string }> {
  const res = await fetch(`${API_URL}/v1/explore/suggestions?limit=${limit}`, {
    credentials: "include",
  });
  return res.json();
}

export async function search(
  query: string,
  type: "users" | "songs" | "all" = "all"
): Promise<{ success: boolean; data?: SearchResults; error?: string }> {
  const res = await fetch(
    `${API_URL}/v1/explore/search?q=${encodeURIComponent(query)}&type=${type}`,
    { credentials: "include" }
  );
  return res.json();
}