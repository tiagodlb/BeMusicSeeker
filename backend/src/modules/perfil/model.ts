import { t } from "elysia";

export namespace UserModel {
    
  export const listQuery = t.Object({
    limit: t.Optional(t.String()),
    offset: t.Optional(t.String()),
    search: t.Optional(t.String()),
    is_artist: t.Optional(t.String()),
  });

  export type ListQuery = typeof listQuery.static;

  export const getByIdParams = t.Object({
    id: t.String(),
  });

  export type GetByIdParams = typeof getByIdParams.static;

  export const updateBody = t.Object({
    name: t.Optional(t.String({ minLength: 1, maxLength: 255 })),
    bio: t.Optional(t.String({ maxLength: 1000 })),
    profile_picture_url: t.Optional(t.String({ maxLength: 500 })),
    is_artist: t.Optional(t.Boolean()),
    social_links: t.Optional(t.String()),
  });

  export type UpdateBody = typeof updateBody.static;

  export const userPublic = t.Object({
    id: t.Number(),
    email: t.String(),
    name: t.String(),
    bio: t.Nullable(t.String()),
    profile_picture_url: t.Nullable(t.String()),
    is_artist: t.Boolean(),
    social_links: t.String(),
    created_at: t.Date(),
  });

  export type UserPublic = typeof userPublic.static;

  export const userList = t.Object({
    users: t.Array(userPublic),
    total: t.Number(),
    limit: t.Number(),
    offset: t.Number(),
  });

  export type UserList = typeof userList.static;

  export const notFound = t.Literal("Usuario nao encontrado");
  export type NotFound = typeof notFound.static;

  export const unauthorized = t.Literal("Nao autorizado");
  export type Unauthorized = typeof unauthorized.static;

  export const invalidId = t.Literal("ID invalido");
  export type InvalidId = typeof invalidId.static;
}