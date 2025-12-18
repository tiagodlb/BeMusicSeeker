const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  user: { id: number; name: string; avatar: string | null };
}

export interface CommentsResponse {
  comments: Comment[];
  total: number;
  hasMore: boolean;
}

export async function getComments(
  postId: number,
  limit = 20,
  offset = 0
): Promise<{ success: boolean; data?: CommentsResponse; error?: string }> {
  const res = await fetch(
    `${API_URL}/v1/posts/${postId}/comments?limit=${limit}&offset=${offset}`,
    { credentials: "include" }
  );
  return res.json();
}

export async function addComment(
  postId: number,
  content: string
): Promise<{ success: boolean; data?: Comment; error?: string }> {
  const res = await fetch(`${API_URL}/v1/posts/${postId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ content }),
  });
  return res.json();
}

export async function deleteComment(
  postId: number,
  commentId: number
): Promise<{ success: boolean; error?: string }> {
  const res = await fetch(`${API_URL}/v1/posts/${postId}/comments/${commentId}`, {
    method: "DELETE",
    credentials: "include",
  });
  return res.json();
}