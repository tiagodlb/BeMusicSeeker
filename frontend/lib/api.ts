const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
console.log("[API] API_BASE_URL:", API_BASE_URL);

type ApiError = {
  message: string;
  code?: string;
  status: number;
};

type ApiResponse<T> = {
  data: T | null;
  error: ApiError | null;
};

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log("[API] request:", options.method || "GET", url);

  const config: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  };

  try {
    const response = await fetch(url, config);
    console.log("[API] response status:", response.status);
    const data = await response.json();
    console.log("[API] response data:", data);

    if (!response.ok) {
      return {
        data: null,
        error: {
          message: data.message || data.error || "Erro desconhecido",
          code: data.code,
          status: response.status,
        },
      };
    }

    return { data, error: null };
  } catch (err) {
    console.error("[API] fetch error:", err);
    return {
      data: null,
      error: {
        message: err instanceof Error ? err.message : "Erro de conexão",
        status: 0,
      },
    };
  }
}

// ============ AUTH ============

export type SignUpPayload = {
  name: string;
  email: string;
  password: string;
};

export type SignUpResponse = {
  user: {
    id: string;
    email: string;
    name: string;
    createdAt: string;
  };
};

export type SignInPayload = {
  email: string;
  password: string;
};

export type SignInResponse = {
  user: {
    id: string;
    email: string;
    name: string;
  };
  session: {
    id: string;
    expiresAt: string;
  };
};

export type User = {
  id: string;
  email: string;
  name: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
};

export const auth = {
  signUp: (payload: SignUpPayload) =>
    request<SignUpResponse>("/v1/auth/api/sign-up/email", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  signIn: (payload: SignInPayload) =>
    request<SignInResponse>("/v1/auth/api/sign-in/email", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  signOut: () =>
    request<{ success: boolean }>("/v1/auth/api/sign-out", {
      method: "POST",
    }),

  getSession: () =>
    request<{ user: User; session: { id: string; expiresAt: string } }>(
      "/v1/auth/api/get-session",
      { method: "GET" }
    ),

  // ============ PASSWORD RESET ============
  forgetPassword: (payload: { email: string; redirectTo: string }) =>
    request<{ success: boolean }>("/v1/auth/api/forget-password", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  resetPassword: (payload: { newPassword: string; token: string }) =>
    request<{ success: boolean }>("/v1/auth/api/reset-password", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

// ============ USERS ============

export type UserData = {
  id: number;
  email: string;
  name: string;
  bio: string | null;
  profile_picture_url: string | null;
  is_artist: boolean;
  social_links: string;
  created_at: string;
};

export type UserStats = {
  postsCount: number;
  songsCount: number;
  followersCount: number;
  followingCount: number;
};

export type UserWithStats = UserData & {
  stats: UserStats;
};

export type UserListResponse = {
  success: boolean;
  data: UserData[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
};

export type UserResponse = {
  success: boolean;
  data: UserData;
};

export type UserMeResponse = {
  success: boolean;
  data: UserWithStats;
};

export type UserStatsResponse = {
  success: boolean;
  data: UserStats;
};

export type ListUsersParams = {
  limit?: number;
  offset?: number;
  search?: string;
  is_artist?: boolean;
};

export type UpdateUserPayload = {
  name?: string;
  bio?: string;
  profile_picture_url?: string;
  is_artist?: boolean;
  social_links?: string;
};

export const users = {
  list: (params: ListUsersParams = {}) => {
    const searchParams = new URLSearchParams();
    if (params.limit) searchParams.set("limit", String(params.limit));
    if (params.offset) searchParams.set("offset", String(params.offset));
    if (params.search) searchParams.set("search", params.search);
    if (params.is_artist !== undefined)
      searchParams.set("is_artist", String(params.is_artist));

    const query = searchParams.toString();
    return request<UserListResponse>(`/v1/users${query ? `?${query}` : ""}`);
  },

  getById: (id: number) => request<UserResponse>(`/v1/users/${id}`),

  getStats: (id: number) => request<UserStatsResponse>(`/v1/users/${id}/stats`),

  getMe: () => request<UserMeResponse>("/v1/users/me"),

  update: (id: number, payload: UpdateUserPayload) =>
    request<UserResponse>(`/v1/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  delete: (id: number) =>
    request<{ success: boolean; message: string }>(`/v1/users/${id}`, {
      method: "DELETE",
    }),
};

export const api = {
  auth,
  users,
  request,
};

export default api;
