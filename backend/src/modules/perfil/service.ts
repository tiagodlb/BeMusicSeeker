import { UserRepository, type UserRow, type ListUsersOptions } from "./repository";
import type { UserModel } from "./model";

type UserError =
  | { code: "NOT_FOUND"; message: string }
  | { code: "INVALID_ID"; message: string }
  | { code: "UNAUTHORIZED"; message: string }
  | { code: "DATABASE_ERROR"; message: string };

type Result<T> = { data: T; error: null } | { data: null; error: UserError };

export abstract class UserService {
  static async getById(id: number): Promise<Result<UserRow>> {
    if (!Number.isInteger(id) || id <= 0) {
      return {
        data: null,
        error: { code: "INVALID_ID", message: "ID invalido" },
      };
    }

    try {
      const user = await UserRepository.findById(id);

      if (!user) {
        return {
          data: null,
          error: { code: "NOT_FOUND", message: "Usuario nao encontrado" },
        };
      }

      return { data: user, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          code: "DATABASE_ERROR",
          message: err instanceof Error ? err.message : "Erro no banco de dados",
        },
      };
    }
  }

  static async list(
    options: ListUsersOptions
  ): Promise<Result<{ users: UserRow[]; total: number }>> {
    try {
      const result = await UserRepository.list(options);
      return { data: result, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          code: "DATABASE_ERROR",
          message: err instanceof Error ? err.message : "Erro no banco de dados",
        },
      };
    }
  }

  static async update(
    id: number,
    data: UserModel.UpdateBody,
    requesterId: number
  ): Promise<Result<UserRow>> {
    if (!Number.isInteger(id) || id <= 0) {
      return {
        data: null,
        error: { code: "INVALID_ID", message: "ID invalido" },
      };
    }

    // users can only update their own profile
    if (id !== requesterId) {
      return {
        data: null,
        error: { code: "UNAUTHORIZED", message: "Nao autorizado" },
      };
    }

    try {
      const existingUser = await UserRepository.findById(id);

      if (!existingUser) {
        return {
          data: null,
          error: { code: "NOT_FOUND", message: "Usuario nao encontrado" },
        };
      }

      const updateData: Parameters<typeof UserRepository.update>[1] = {};

      if (data.name !== undefined) updateData.name = data.name;
      if (data.bio !== undefined) updateData.bio = data.bio || null;
      if (data.profile_picture_url !== undefined)
        updateData.profile_picture_url = data.profile_picture_url || null;
      if (data.is_artist !== undefined) updateData.is_artist = data.is_artist;
      if (data.social_links !== undefined)
        updateData.social_links = data.social_links;

      const user = await UserRepository.update(id, updateData);

      if (!user) {
        return {
          data: null,
          error: { code: "NOT_FOUND", message: "Usuario nao encontrado" },
        };
      }

      return { data: user, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          code: "DATABASE_ERROR",
          message: err instanceof Error ? err.message : "Erro no banco de dados",
        },
      };
    }
  }

  static async delete(id: number, requesterId: number): Promise<Result<boolean>> {
    if (!Number.isInteger(id) || id <= 0) {
      return {
        data: null,
        error: { code: "INVALID_ID", message: "ID invalido" },
      };
    }

    // users can only delete their own account
    if (id !== requesterId) {
      return {
        data: null,
        error: { code: "UNAUTHORIZED", message: "Nao autorizado" },
      };
    }

    try {
      const deleted = await UserRepository.delete(id);

      if (!deleted) {
        return {
          data: null,
          error: { code: "NOT_FOUND", message: "Usuario nao encontrado" },
        };
      }

      return { data: true, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          code: "DATABASE_ERROR",
          message: err instanceof Error ? err.message : "Erro no banco de dados",
        },
      };
    }
  }

  static async getStats(
    id: number
  ): Promise<
    Result<{
      postsCount: number;
      songsCount: number;
      followersCount: number;
      followingCount: number;
    }>
  > {
    if (!Number.isInteger(id) || id <= 0) {
      return {
        data: null,
        error: { code: "INVALID_ID", message: "ID invalido" },
      };
    }

    try {
      const stats = await UserRepository.getStats(id);

      if (!stats) {
        return {
          data: null,
          error: { code: "NOT_FOUND", message: "Usuario nao encontrado" },
        };
      }

      return { data: stats, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          code: "DATABASE_ERROR",
          message: err instanceof Error ? err.message : "Erro no banco de dados",
        },
      };
    }
  }
}