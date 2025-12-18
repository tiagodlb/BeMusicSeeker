const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface FavoriteSong {
  id: number;
  savedAt: string;
  song: {
    id: number;
    title: string;
    genre: string;
    coverUrl: string | null;
    url: string;
    artist: {
      id: number;
      name: string;
    };
  };
}

export interface FavoritesResponse {
  favorites: FavoriteSong[];
  total: number;
  hasMore: boolean;
}

export async function getFavorites(
  limit = 20,
  offset = 0
): Promise<{ success: boolean; data?: FavoritesResponse; error?: string }> {
  const res = await fetch(
    `${API_URL}/v1/favorites?limit=${limit}&offset=${offset}`,
    { credentials: "include" }
  );
  return res.json();
}

export async function toggleFavorite(
  songId: number
): Promise<{ success: boolean; data?: { action: string; isFavorite: boolean }; error?: string }> {
  const res = await fetch(`${API_URL}/v1/favorites/${songId}`, {
    method: "POST",
    credentials: "include",
  });
  return res.json();
}

export async function checkFavorites(
  songIds: number[]
): Promise<{ success: boolean; data?: { savedIds: number[] }; error?: string }> {
  const res = await fetch(`${API_URL}/v1/favorites/check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ songIds }),
  });
  return res.json();
}

export async function isFavorite(
  songId: number
): Promise<{ success: boolean; data?: { isFavorite: boolean }; error?: string }> {
  const res = await fetch(`${API_URL}/v1/favorites/${songId}`, {
    credentials: "include",
  });
  return res.json();
}