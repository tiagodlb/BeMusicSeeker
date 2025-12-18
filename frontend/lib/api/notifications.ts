const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface Notification {
  id: number;
  type: "comment" | "vote" | "follow" | "new_song" | "mention";
  content: string;
  related_id: number | null;
  related_type: "post" | "comment" | "song" | "user" | null;
  is_read: boolean;
  created_at: string;
}

interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
  hasMore: boolean;
}

// Helper para tratar respostas da API com segurança
async function handleResponse(res: Response) {
  if (!res.ok) {
    // Se for 401 (Não autorizado), retornamos sucesso: false silenciosamente
    if (res.status === 401) {
      return { success: false, error: "Não autenticado" };
    }

    // Tenta ler o erro como JSON, se falhar, lê como texto
    try {
      const data = await res.json();
      return { success: false, error: data.error || "Erro na requisição" };
    } catch {
      return { success: false, error: await res.text() };
    }
  }
  return res.json();
}

export async function getNotifications(
  page = 1
): Promise<{ success: boolean; data?: NotificationsResponse }> {
  try {
    const res = await fetch(`${API_URL}/v1/notifications?page=${page}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    return handleResponse(res);
  } catch (error) {
    return { success: false };
  }
}

export async function getUnreadCount(): Promise<{
  success: boolean;
  data?: { count: number };
}> {
  try {
    const res = await fetch(`${API_URL}/v1/notifications/unread-count`, {
      credentials: "include",
    });
    return handleResponse(res);
  } catch (error) {
    return { success: false };
  }
}

export async function markAsRead(id: number): Promise<{ success: boolean }> {
  const res = await fetch(`${API_URL}/v1/notifications/${id}/read`, {
    method: "PATCH",
    credentials: "include",
  });
  return handleResponse(res);
}

export async function markAllAsRead(): Promise<{ success: boolean }> {
  const res = await fetch(`${API_URL}/v1/notifications/mark-all-read`, {
    method: "PATCH",
    credentials: "include",
  });
  return handleResponse(res);
}
