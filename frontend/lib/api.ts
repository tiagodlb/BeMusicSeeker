const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

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
    const data = await response.json();

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
    request<SignUpResponse>("/v1/api/sign-up", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  signIn: (payload: SignInPayload) =>
    request<SignInResponse>("/v1/api/sign-in/email", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  signOut: () =>
    request<{ success: boolean }>("/v1/api/sign-out", {
      method: "POST",
    }),

  getSession: () =>
    request<{ user: User; session: { id: string; expiresAt: string } }>(
      "/v1/api/get-session",
      { method: "GET" }
    ),
};

export const api = {
  auth,
  request,
};

export default api;