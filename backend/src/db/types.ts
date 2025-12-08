import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

import type { VoteType, ModerationStatus, NotificationType, RelatedType, ReportedType, ReportStatus } from "./enums";

export type Comment = {
    id: Generated<number>;
    user_id: number;
    post_id: number;
    content: string;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
};
export type Follow = {
    id: Generated<number>;
    follower_id: number;
    following_id: number;
    created_at: Generated<Timestamp>;
};
export type Notification = {
    id: Generated<number>;
    user_id: number;
    type: NotificationType;
    content: string;
    related_id: number | null;
    related_type: RelatedType | null;
    is_read: Generated<boolean>;
    created_at: Generated<Timestamp>;
};
export type Post = {
    id: Generated<number>;
    user_id: number;
    song_id: number;
    content: string;
    upvotes_count: Generated<number>;
    downvotes_count: Generated<number>;
    comments_count: Generated<number>;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
};
export type PostTag = {
    id: Generated<number>;
    post_id: number;
    tag: string;
    created_at: Generated<Timestamp>;
};
export type Report = {
    id: Generated<number>;
    reporter_id: number;
    reported_type: ReportedType;
    reported_id: number;
    reason: string;
    status: Generated<ReportStatus>;
    created_at: Generated<Timestamp>;
    reviewed_at: Timestamp | null;
};
export type SavedSong = {
    id: Generated<number>;
    user_id: number;
    song_id: number;
    created_at: Generated<Timestamp>;
};
export type Song = {
    id: Generated<number>;
    title: string;
    description: string | null;
    artist_id: number;
    genre: string;
    duration_seconds: number;
    file_url: string;
    cover_image_url: string | null;
    play_count: Generated<number>;
    moderation_status: Generated<ModerationStatus>;
    report_count: Generated<number>;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
};
export type User = {
    id: Generated<number>;
    email: string;
    password_hash: string;
    name: string;
    bio: string | null;
    profile_picture_url: string | null;
    is_artist: Generated<boolean>;
    social_links: string;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
};
export type Vote = {
    id: Generated<number>;
    user_id: number;
    post_id: number;
    vote_type: VoteType;
    created_at: Generated<Timestamp>;
};
export type DB = {
    comments: Comment;
    follows: Follow;
    notifications: Notification;
    post_tags: PostTag;
    posts: Post;
    reports: Report;
    saved_songs: SavedSong;
    songs: Song;
    users: User;
    votes: Vote;
};
