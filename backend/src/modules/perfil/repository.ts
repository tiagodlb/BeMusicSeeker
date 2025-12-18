import { prisma } from "../../db/client";

export interface UserRow {
  id: number;
  email: string;
  name: string;
  bio: string | null;
  profile_picture_url: string | null;
  is_artist: boolean;
  social_links: string;
  created_at: Date;
  updated_at: Date;
}

export interface ListUsersOptions {
  limit: number;
  offset: number;
  search?: string;
  isArtist?: boolean;
}

export interface CreateUserData {
  email: string;
  name: string;
  password_hash: string;
  bio?: string;
  profile_picture_url?: string;
  is_artist?: boolean;
  social_links?: string;
}

export abstract class UserRepository {
  static async create(data: CreateUserData): Promise<UserRow | null> {
    try {
      const user = await prisma
        .insertInto("users")
        .values({
          email: data.email,
          name: data.name,
          password_hash: data.password_hash,
          bio: data.bio ?? null,
          profile_picture_url: data.profile_picture_url ?? null,
          is_artist: data.is_artist ?? false,
          social_links: data.social_links ?? "{}",
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning([
          "id",
          "email",
          "name",
          "bio",
          "profile_picture_url",
          "is_artist",
          "social_links",
          "created_at",
          "updated_at",
        ])
        .executeTakeFirst();

      return user ?? null;
    } catch (error) {
      console.error("Error creating user:", error);
      return null;
    }
  }

  static async findById(id: number): Promise<UserRow | null> {
    const user = await prisma
      .selectFrom("users")
      .select([
        "id",
        "email",
        "name",
        "bio",
        "profile_picture_url",
        "is_artist",
        "social_links",
        "created_at",
        "updated_at",
      ])
      .where("id", "=", id)
      .executeTakeFirst();

    return user ?? null;
  }

  static async findByEmail(email: string): Promise<UserRow | null> {
    const user = await prisma
      .selectFrom("users")
      .select([
        "id",
        "email",
        "name",
        "bio",
        "profile_picture_url",
        "is_artist",
        "social_links",
        "created_at",
        "updated_at",
      ])
      .where("email", "=", email)
      .executeTakeFirst();

    return user ?? null;
  }

  static async list(options: ListUsersOptions): Promise<{
    users: UserRow[];
    total: number;
  }> {
    let query = prisma
      .selectFrom("users")
      .select([
        "id",
        "email",
        "name",
        "bio",
        "profile_picture_url",
        "is_artist",
        "social_links",
        "created_at",
        "updated_at",
      ]);

    let countQuery = prisma
      .selectFrom("users")
      .select((eb) => eb.fn.countAll<number>().as("count"));

    if (options.search) {
      const searchTerm = `%${options.search}%`;
      query = query.where((eb) =>
        eb.or([
          eb("name", "ilike", searchTerm),
          eb("email", "ilike", searchTerm),
        ])
      );
      countQuery = countQuery.where((eb) =>
        eb.or([
          eb("name", "ilike", searchTerm),
          eb("email", "ilike", searchTerm),
        ])
      );
    }

    if (options.isArtist !== undefined) {
      query = query.where("is_artist", "=", options.isArtist);
      countQuery = countQuery.where("is_artist", "=", options.isArtist);
    }

    const users = await query
      .orderBy("created_at", "desc")
      .limit(options.limit)
      .offset(options.offset)
      .execute();

    const countResult = await countQuery.executeTakeFirst();
    const total = Number(countResult?.count ?? 0);

    return { users, total };
  }

  static async update(
    id: number,
    data: Partial<{
      name: string;
      bio: string | null;
      profile_picture_url: string | null;
      is_artist: boolean;
      social_links: string;
    }>
  ): Promise<UserRow | null> {
    const user = await prisma
      .updateTable("users")
      .set({
        ...data,
        updated_at: new Date(),
      })
      .where("id", "=", id)
      .returning([
        "id",
        "email",
        "name",
        "bio",
        "profile_picture_url",
        "is_artist",
        "social_links",
        "created_at",
        "updated_at",
      ])
      .executeTakeFirst();

    return user ?? null;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await prisma
      .deleteFrom("users")
      .where("id", "=", id)
      .executeTakeFirst();

    return (result.numDeletedRows ?? 0) > 0;
  }

  static async getStats(id: number): Promise<{
    postsCount: number;
    songsCount: number;
    followersCount: number;
    followingCount: number;
  } | null> {
    const user = await prisma
      .selectFrom("users")
      .select("id")
      .where("id", "=", id)
      .executeTakeFirst();

    if (!user) return null;

    const [posts, songs, followers, following] = await Promise.all([
      prisma
        .selectFrom("posts")
        .select((eb) => eb.fn.countAll<number>().as("count"))
        .where("user_id", "=", id)
        .executeTakeFirst(),
      prisma
        .selectFrom("songs")
        .select((eb) => eb.fn.countAll<number>().as("count"))
        .where("artist_id", "=", id)
        .executeTakeFirst(),
      prisma
        .selectFrom("follows")
        .select((eb) => eb.fn.countAll<number>().as("count"))
        .where("following_id", "=", id)
        .executeTakeFirst(),
      prisma
        .selectFrom("follows")
        .select((eb) => eb.fn.countAll<number>().as("count"))
        .where("follower_id", "=", id)
        .executeTakeFirst(),
    ]);

    return {
      postsCount: Number(posts?.count ?? 0),
      songsCount: Number(songs?.count ?? 0),
      followersCount: Number(followers?.count ?? 0),
      followingCount: Number(following?.count ?? 0),
    };
  }
}