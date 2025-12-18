"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { getComments, addComment, deleteComment, Comment } from "@/lib/api/comments";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MessageCircle, Loader2, Send, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "agora";
  if (diffMins < 60) return `${diffMins}min`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString("pt-BR", { day: "numeric", month: "short" });
}

interface CommentItemProps {
  comment: Comment;
  isOwner: boolean;
  onDelete: (id: number) => void;
}

function CommentItem({ comment, isOwner, onDelete }: CommentItemProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <div className="group flex gap-3 py-3">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={comment.user.avatar || undefined} />
          <AvatarFallback className="text-xs bg-muted">
            {comment.user.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="font-medium text-sm truncate">
              {comment.user.name}
            </span>
            <span className="text-xs text-muted-foreground shrink-0">
              {formatRelativeTime(comment.createdAt)}
            </span>
          </div>
          <p className="text-sm text-foreground/90 whitespace-pre-wrap break-words">
            {comment.content}
          </p>
        </div>

        {isOwner && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir comentario</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este comentario? Esta acao nao pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(comment.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

interface CommentsDrawerProps {
  postId: number;
  commentsCount: number;
  onCountChange?: (delta: number) => void;
}

export function CommentsDrawer({ postId, commentsCount, onCountChange }: CommentsDrawerProps) {
  const { user, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [total, setTotal] = useState(commentsCount);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [content, setContent] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const loadComments = async (offset = 0, append = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const res = await getComments(postId, 15, offset);
      if (res.success && res.data) {
        setComments((prev) => (append ? [...prev, ...res.data!.comments] : res.data!.comments));
        setTotal(res.data.total);
        setHasMore(res.data.hasMore);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (open && comments.length === 0) {
      loadComments();
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!content.trim() || submitting || !isAuthenticated) return;

    setSubmitting(true);
    try {
      const res = await addComment(postId, content.trim());
      if (res.success && res.data) {
        setComments((prev) => [res.data!, ...prev]);
        setTotal((t) => t + 1);
        setContent("");
        onCountChange?.(1);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    const res = await deleteComment(postId, commentId);
    if (res.success) {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      setTotal((t) => t - 1);
      onCountChange?.(-1);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
          <MessageCircle className="h-4 w-4" />
          <span className="text-sm tabular-nums">{total}</span>
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="px-4 py-3 border-b shrink-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-base">
              Comentarios
              {total > 0 && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({total})
                </span>
              )}
            </SheetTitle>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MessageCircle className="h-10 w-10 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">
                Nenhum comentario ainda
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Seja o primeiro a comentar
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  isOwner={user?.id === comment.user.id}
                  onDelete={handleDelete}
                />
              ))}

              {hasMore && (
                <div className="py-4 flex justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => loadComments(comments.length, true)}
                    disabled={loadingMore}
                    className="text-muted-foreground"
                  >
                    {loadingMore ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Carregar mais
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {isAuthenticated ? (
          <form
            onSubmit={handleSubmit}
            className="shrink-0 border-t px-4 py-3 bg-background"
          >
            <div className="flex gap-2 items-center">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src={user?.profile_picture_url || undefined} />
                <AvatarFallback className="text-xs">
                  {user?.name?.slice(0, 2).toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <Input
                ref={inputRef}
                placeholder="Escreva um comentario..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="flex-1"
                maxLength={1000}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!content.trim() || submitting}
                className="shrink-0"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="shrink-0 border-t px-4 py-3 bg-muted/50">
            <p className="text-sm text-center text-muted-foreground">
              Faca login para comentar
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}