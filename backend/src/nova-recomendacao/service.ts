import { prisma } from "../db/client";

export interface CreateRecommendationInput {
  title: string;
  artist: string;
  genre: string;
  description: string;
  tags: string[];
  mediaUrl?: string;
  userId: number;
}

export class RecommendationService {
  async createRecommendation(data: CreateRecommendationInput) {
    // Validar campos obrigatórios
    if (
      !data.title?.trim() ||
      !data.artist?.trim() ||
      !data.genre ||
      !data.description?.trim() ||
      data.tags.length === 0
    ) {
      throw new Error("Campos obrigatórios não preenchidos");
    }

    // Validar comprimento da descrição
    if (data.description.length > 500) {
      throw new Error("Descrição não pode exceder 500 caracteres");
    }

    // Validar tags
    if (!Array.isArray(data.tags) || data.tags.length === 0) {
      throw new Error("Selecione pelo menos uma tag");
    }

    try {
      // Criar a música (Song)
      const songResult = await prisma
        .insertInto("songs")
        .values({
          title: data.title.trim(),
          artist_id: data.userId,
          genre: data.genre,
          description: data.artist.trim(),
          duration_seconds: 0,
          file_url: data.mediaUrl || "",
          cover_image_url: "",
          moderation_status: "pending",
        })
        .returningAll()
        .executeTakeFirstOrThrow();

      // Criar o Post (recomendação)
      const postResult = await prisma
        .insertInto("posts")
        .values({
          user_id: data.userId,
          song_id: songResult.id,
          content: data.description.trim(),
        })
        .returningAll()
        .executeTakeFirstOrThrow();

      // Adicionar tags
      if (data.tags.length > 0) {
        await Promise.all(
          data.tags.map((tag: string) =>
            prisma
              .insertInto("post_tags")
              .values({
                post_id: postResult.id,
                tag: tag.trim(),
              })
              .execute()
          )
        );
      }

      // Retornar recomendação com dados completos
      const fullPost = await prisma
        .selectFrom("posts")
        .where("posts.id", "=", postResult.id)
        .innerJoin("users", "posts.user_id", "users.id")
        .innerJoin("songs", "posts.song_id", "songs.id")
        .leftJoin("post_tags", "posts.id", "post_tags.post_id")
        .select([
          "posts.id",
          "posts.content",
          "posts.created_at",
          "users.id as user_id",
          "users.name",
          "users.profile_picture_url",
          "songs.id as song_id",
          "songs.title as song_title",
          "songs.description as artist",
          "songs.genre",
          "songs.cover_image_url",
          "songs.file_url",
          "post_tags.tag",
        ])
        .executeTakeFirst();

      if (!fullPost) {
        throw new Error("Falha ao recuperar recomendação criada");
      }

      return {
        id: fullPost.id,
        user: {
          id: fullPost.user_id,
          name: fullPost.name,
          avatar: fullPost.profile_picture_url,
        },
        music: {
          id: fullPost.song_id,
          title: fullPost.song_title,
          artist: fullPost.artist,
          genre: fullPost.genre,
          coverUrl: fullPost.cover_image_url,
          link: fullPost.file_url,
        },
        description: fullPost.content,
        tags: data.tags, // Usar tags do input já que foram validadas
        createdAt: fullPost.created_at,
      };
    } catch (error) {
      console.error("Erro ao criar recomendação:", error);
      throw error;
    }
  }

  async getRecommendations(limit = 10, offset = 0) {
    const posts = await prisma
      .selectFrom("posts")
      .innerJoin("users", "posts.user_id", "users.id")
      .innerJoin("songs", "posts.song_id", "songs.id")
      .leftJoin("post_tags", "posts.id", "post_tags.post_id")
      .leftJoin("votes", "posts.id", "votes.post_id")
      .select([
        "posts.id",
        "posts.content",
        "posts.upvotes_count",
        "posts.downvotes_count",
        "posts.comments_count",
        "posts.created_at",
        "users.id as user_id",
        "users.name",
        "users.profile_picture_url",
        "songs.id as song_id",
        "songs.title as song_title",
        "songs.description as artist",
        "songs.genre",
        "songs.cover_image_url",
        "songs.file_url",
        "post_tags.tag",
      ])
      .orderBy("posts.created_at", "desc")
      .limit(limit)
      .offset(offset)
      .execute();

    // Group by post to consolidate tags
    const groupedPosts = new Map();

    posts.forEach((post: any) => {
      if (!groupedPosts.has(post.id)) {
        groupedPosts.set(post.id, {
          id: post.id,
          user: {
            id: post.user_id,
            name: post.name,
            avatar: post.profile_picture_url,
          },
          music: {
            id: post.song_id,
            title: post.song_title,
            artist: post.artist,
            genre: post.genre,
            coverUrl: post.cover_image_url,
            link: post.file_url,
          },
          description: post.content,
          tags: [],
          stats: {
            upvotes: post.upvotes_count,
            downvotes: post.downvotes_count,
            comments: post.comments_count,
          },
          createdAt: post.created_at,
        });
      }

      if (post.tag) {
        const currentPost = groupedPosts.get(post.id);
        if (!currentPost.tags.includes(post.tag)) {
          currentPost.tags.push(post.tag);
        }
      }
    });

    return Array.from(groupedPosts.values());
  }}