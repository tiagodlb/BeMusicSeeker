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

export interface VoteInput {
  postId: number;
  userId: number;
  voteType: "upvote" | "downvote";
}

export class RecommendationService {
  async vote(data: VoteInput) {
    const { postId, userId, voteType } = data;

    // check existing vote
    const existingVote = await prisma
      .selectFrom("votes")
      .where("post_id", "=", postId)
      .where("user_id", "=", userId)
      .selectAll()
      .executeTakeFirst();

    if (!existingVote) {
      // no vote exists - create new
      await prisma
        .insertInto("votes")
        .values({
          post_id: postId,
          user_id: userId,
          vote_type: voteType,
        })
        .execute();

      // increment counter
      if (voteType === "upvote") {
        await prisma
          .updateTable("posts")
          .set((eb) => ({ upvotes_count: eb("upvotes_count", "+", 1) }))
          .where("id", "=", postId)
          .execute();
      } else {
        await prisma
          .updateTable("posts")
          .set((eb) => ({ downvotes_count: eb("downvotes_count", "+", 1) }))
          .where("id", "=", postId)
          .execute();
      }

      return { action: "created", voteType };
    }

    if (existingVote.vote_type === voteType) {
      // same vote - toggle off (delete)
      await prisma
        .deleteFrom("votes")
        .where("id", "=", existingVote.id)
        .execute();

      // decrement counter
      if (voteType === "upvote") {
        await prisma
          .updateTable("posts")
          .set((eb) => ({ upvotes_count: eb("upvotes_count", "-", 1) }))
          .where("id", "=", postId)
          .execute();
      } else {
        await prisma
          .updateTable("posts")
          .set((eb) => ({ downvotes_count: eb("downvotes_count", "-", 1) }))
          .where("id", "=", postId)
          .execute();
      }

      return { action: "removed", voteType: null };
    }

    // different vote - switch
    await prisma
      .updateTable("votes")
      .set({ vote_type: voteType })
      .where("id", "=", existingVote.id)
      .execute();

    // adjust counters
    if (voteType === "upvote") {
      // was downvote, now upvote
      await prisma
        .updateTable("posts")
        .set((eb) => ({
          upvotes_count: eb("upvotes_count", "+", 1),
          downvotes_count: eb("downvotes_count", "-", 1),
        }))
        .where("id", "=", postId)
        .execute();
    } else {
      // was upvote, now downvote
      await prisma
        .updateTable("posts")
        .set((eb) => ({
          upvotes_count: eb("upvotes_count", "-", 1),
          downvotes_count: eb("downvotes_count", "+", 1),
        }))
        .where("id", "=", postId)
        .execute();
    }

    return { action: "changed", voteType };
  }

  async createRecommendation(data: CreateRecommendationInput) {
    if (
      !data.title?.trim() ||
      !data.artist?.trim() ||
      !data.genre ||
      !data.description?.trim() ||
      data.tags.length === 0
    ) {
      throw new Error("Campos obrigatórios não preenchidos");
    }

    if (data.description.length > 500) {
      throw new Error("Descrição não pode exceder 500 caracteres");
    }

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
          description: data.artist.trim(), // artist name stored in description
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

      // Buscar user info
      const user = await prisma
        .selectFrom("users")
        .where("id", "=", data.userId)
        .select(["id", "name", "profile_picture_url"])
        .executeTakeFirst();

      return {
        id: postResult.id,
        user: {
          id: user?.id ?? data.userId,
          name: user?.name ?? "Usuario",
          avatar: user?.profile_picture_url ?? null,
        },
        music: {
          id: songResult.id,
          title: songResult.title,
          artist: data.artist.trim(),
          genre: songResult.genre,
          coverUrl: songResult.cover_image_url,
          link: songResult.file_url,
        },
        description: postResult.content,
        tags: data.tags,
        stats: {
          upvotes: 0,
          downvotes: 0,
          comments: 0,
        },
        createdAt: postResult.created_at,
      };
    } catch (error) {
      console.error("Erro ao criar recomendação:", error);
      throw error;
    }
  }

  async getRecommendations(limit = 10, offset = 0, currentUserId?: number) {
    const posts = await prisma
      .selectFrom("posts")
      .innerJoin("users", "posts.user_id", "users.id")
      .innerJoin("songs", "posts.song_id", "songs.id")
      .leftJoin("post_tags", "posts.id", "post_tags.post_id")
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

    // Get user votes if logged in
    let userVotes = new Map<number, string>();
    if (currentUserId) {
      const postIds = [...new Set(posts.map((p: any) => p.id))];
      if (postIds.length > 0) {
        const votes = await prisma
          .selectFrom("votes")
          .where("user_id", "=", currentUserId)
          .where("post_id", "in", postIds)
          .select(["post_id", "vote_type"])
          .execute();
        
        votes.forEach((v: any) => {
          userVotes.set(v.post_id, v.vote_type);
        });
      }
    }

    // Group by post to consolidate tags
    const groupedPosts = new Map();

    posts.forEach((post: any) => {
      if (!groupedPosts.has(post.id)) {
        const voteType = userVotes.get(post.id);
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
            upvotes: post.upvotes_count ?? 0,
            downvotes: post.downvotes_count ?? 0,
            comments: post.comments_count ?? 0,
          },
          userVote: voteType === "upvote" ? "up" : voteType === "downvote" ? "down" : null,
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
  }
}