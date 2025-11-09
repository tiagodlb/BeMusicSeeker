export const VoteType = {
    upvote: "upvote",
    downvote: "downvote"
} as const;
export type VoteType = (typeof VoteType)[keyof typeof VoteType];
export const ModerationStatus = {
    pending: "pending",
    approved: "approved",
    flagged: "flagged",
    rejected: "rejected"
} as const;
export type ModerationStatus = (typeof ModerationStatus)[keyof typeof ModerationStatus];
export const NotificationType = {
    comment: "comment",
    vote: "vote",
    follow: "follow",
    new_song: "new_song",
    mention: "mention"
} as const;
export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];
export const RelatedType = {
    post: "post",
    comment: "comment",
    song: "song",
    user: "user"
} as const;
export type RelatedType = (typeof RelatedType)[keyof typeof RelatedType];
export const ReportedType = {
    song: "song",
    post: "post",
    comment: "comment"
} as const;
export type ReportedType = (typeof ReportedType)[keyof typeof ReportedType];
export const ReportStatus = {
    pending: "pending",
    reviewed: "reviewed",
    resolved: "resolved",
    dismissed: "dismissed"
} as const;
export type ReportStatus = (typeof ReportStatus)[keyof typeof ReportStatus];
