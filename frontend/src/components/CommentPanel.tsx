import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { getCurrentUsername } from "../lib/auth";
import type { CommentResponse } from "../types";
import Button from "./Button";
import Avatar from "./Avatar";

interface Props {
  postId: number;
  open: boolean;
  onClose: () => void;
  onCountChange: (count: number) => void;
}

function CommentRow({
  comment,
  size,
  onReply,
}: {
  comment: CommentResponse;
  size: number;
  onReply?: () => void;
}) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
        <Avatar
          username={comment.authorUsername}
          avatarUrl={comment.authorAvatarUrl}
          avatarPosition={comment.authorAvatarPosition}
          size={size}
        />
        {comment.authorUsername}
      </p>
      <p className="mt-0.5 whitespace-pre-wrap break-words text-sm text-gray-200">{comment.content}</p>
      {onReply && (
        <button type="button" onClick={onReply} className="mt-1 text-xs font-medium text-gray-500 hover:text-white">
          Trả lời
        </button>
      )}
    </div>
  );
}

export default function CommentPanel({ postId, open, onClose, onCountChange }: Props) {
  const [comments, setComments] = useState<CommentResponse[] | null>(null);
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");
  const [replyingTo, setReplyingTo] = useState<{ rootId: number; targetId: number; targetUsername: string } | null>(
    null
  );
  const [replyText, setReplyText] = useState("");
  const [postingReply, setPostingReply] = useState(false);
  const [collapsedRoots, setCollapsedRoots] = useState<Set<number>>(new Set());
  const isAuthed = Boolean(getCurrentUsername());

  useEffect(() => {
    api
      .get<CommentResponse[]>(`/comments/posts/${postId}`)
      .then((res) => setComments(res.data))
      .catch(() => setError("Không tải được bình luận."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  // Reporting the count to the parent is a side effect of `comments` changing,
  // not something to do inside a setState updater (that runs during render).
  useEffect(() => {
    if (comments !== null) onCountChange(comments.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comments]);

  const roots = (comments ?? []).filter((c) => c.parentId == null);
  const repliesByRoot = new Map<number, CommentResponse[]>();
  (comments ?? [])
    .filter((c) => c.parentId != null)
    .forEach((c) => {
      const key = c.parentId!;
      repliesByRoot.set(key, [...(repliesByRoot.get(key) ?? []), c]);
    });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setPosting(true);
    setError("");
    try {
      const res = await api.post<CommentResponse>(`/comments/posts/${postId}`, { content: text });
      setComments((prev) => [...(prev ?? []), res.data]);
      setText("");
    } catch {
      setError("Đăng bình luận thất bại.");
    } finally {
      setPosting(false);
    }
  }

  async function handleReplySubmit() {
    if (!replyText.trim() || !replyingTo) return;
    const { rootId, targetId } = replyingTo;
    setPostingReply(true);
    setError("");
    try {
      const res = await api.post<CommentResponse>(`/comments/posts/${postId}`, {
        content: replyText,
        parentId: targetId,
      });
      setComments((prev) => [...(prev ?? []), res.data]);
      setReplyText("");
      setReplyingTo(null);
      setCollapsedRoots((prev) => {
        const next = new Set(prev);
        next.delete(rootId);
        return next;
      });
    } catch {
      setError("Đăng trả lời thất bại.");
    } finally {
      setPostingReply(false);
    }
  }

  function toggleCollapsed(rootId: number) {
    setCollapsedRoots((prev) => {
      const next = new Set(prev);
      if (next.has(rootId)) next.delete(rootId);
      else next.add(rootId);
      return next;
    });
  }

  return (
    <div
      className="sticky top-0 h-[80vh] shrink-0 overflow-hidden border-l border-white/10 bg-gray-950 transition-[width] duration-300 ease-out"
      style={{ width: open ? 360 : 0 }}
    >
      <div className="flex h-full w-[360px] flex-col">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
          <h2 className="text-sm font-semibold text-white">Bình luận</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng bình luận"
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-white/10 hover:text-white"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {error && <p className="text-sm text-red-500">{error}</p>}

          {comments === null && !error && <p className="text-sm text-gray-500">Đang tải...</p>}

          {comments !== null && comments.length === 0 && (
            <p className="text-sm text-gray-500">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
          )}

          <ul className="space-y-4">
            {roots.map((c) => {
              const replies = repliesByRoot.get(c.id) ?? [];
              const collapsed = collapsedRoots.has(c.id);
              return (
                <li key={c.id}>
                  <CommentRow
                    comment={c}
                    size={26}
                    onReply={
                      isAuthed
                        ? () =>
                            setReplyingTo(
                              replyingTo?.targetId === c.id
                                ? null
                                : { rootId: c.id, targetId: c.id, targetUsername: c.authorUsername }
                            )
                        : undefined
                    }
                  />

                  {replies.length > 0 && (
                    <button
                      type="button"
                      onClick={() => toggleCollapsed(c.id)}
                      className="mt-2 flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-white"
                    >
                      <span className="h-px w-4 bg-gray-600" />
                      {collapsed ? `Xem ${replies.length} câu trả lời` : "Ẩn"}
                    </button>
                  )}

                  {!collapsed && replies.length > 0 && (
                    <ul className="mt-3 ml-6 space-y-3 border-l border-white/10 pl-4">
                      {replies.map((r) => (
                        <li key={r.id}>
                          <CommentRow
                            comment={r}
                            size={22}
                            onReply={
                              isAuthed
                                ? () =>
                                    setReplyingTo(
                                      replyingTo?.targetId === r.id
                                        ? null
                                        : { rootId: c.id, targetId: r.id, targetUsername: r.authorUsername }
                                    )
                                : undefined
                            }
                          />
                        </li>
                      ))}
                    </ul>
                  )}

                  {replyingTo?.rootId === c.id && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleReplySubmit();
                      }}
                      className="mt-2 ml-6 flex items-end gap-2 pl-4"
                    >
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={`Trả lời ${replyingTo.targetUsername}...`}
                        rows={1}
                        autoFocus
                        className="flex-1 resize-none rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-xs text-white outline-none placeholder:text-gray-500 focus:border-pink-400 focus:ring-2 focus:ring-pink-500/20"
                      />
                      <Button
                        type="submit"
                        disabled={postingReply || !replyText.trim()}
                        className="!px-3 !py-2 text-xs"
                      >
                        Gửi
                      </Button>
                    </form>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="border-t border-white/10 p-4">
          {isAuthed ? (
            <form onSubmit={handleSubmit} className="flex items-end gap-2">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Thêm bình luận..."
                rows={1}
                className="flex-1 resize-none rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white outline-none placeholder:text-gray-500 focus:border-pink-400 focus:ring-2 focus:ring-pink-500/20"
              />
              <Button type="submit" disabled={posting || !text.trim()} className="!px-3 !py-2 text-xs">
                Gửi
              </Button>
            </form>
          ) : (
            <p className="text-sm text-gray-400">
              <Link to="/login" className="text-pink-500 hover:text-pink-600">
                Đăng nhập
              </Link>{" "}
              để bình luận.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
